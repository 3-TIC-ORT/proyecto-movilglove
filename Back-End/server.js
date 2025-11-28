import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";
import { SerialPort, ReadlineParser } from "serialport";

function cargarUsuarios() {
  try {
    return JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  } catch {
    return [];
  }
}

function guardarUsuarios(lista) {
  fs.writeFileSync("usuario.json", JSON.stringify(lista, null, 2), "utf-8");
}

function iniciarSesion(usuario, contraseña) {
  const lista = cargarUsuarios();
  const user = lista.find(u => u.usuario === usuario);
  if (!user) return { success: false, msg: "El nombre de usuario no existe" };
  if (user.contraseña === contraseña) return { success: true, msg: "Inicio de sesión correcto" };
  return { success: false, msg: "Contraseña incorrecta" };
}

function registrarse(usuario, contraseña) {
  const lista = cargarUsuarios();
  const existe = lista.find(u => u.usuario === usuario);
  if (existe) return { success: false, msg: "El usuario ya existe" };
  lista.push({ usuario, contraseña });
  guardarUsuarios(lista);
  return { success: true, msg: "Usuario registrado correctamente" };
}

subscribePOSTEvent("login", data => iniciarSesion(data.usuario, data.contraseña));
subscribePOSTEvent("register", data => registrarse(data.usuario, data.contraseña));

let usuarioActual = null;

subscribePOSTEvent("actualizarUsuarioActual", data => {
  usuarioActual = data.usuario;
  return { success: true };
});

function cargarMovimientosDeUsuario(usuario) {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    const lista = JSON.parse(contenido);
    return lista.find(u => u.usuario === usuario);
  } catch {
    return null;
  }
}

subscribePOSTEvent("guardarConfiguracion", data => {
  if (!data.usuario) return { success: false, msg: "No llegó el usuario desde el front" };
  if (!data.movimientos) return { success: false, msg: "No llegaron los movimientos" };

  let movimientos = [];
  if (fs.existsSync("movimientos.json")) {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") movimientos = JSON.parse(contenido);
  }

  const existente = movimientos.find(u => u.usuario === data.usuario);
  if (existente) existente.movimientos = data.movimientos;
  else movimientos.push(data);

  fs.writeFileSync("movimientos.json", JSON.stringify(movimientos, null, 2), "utf-8");

  return { success: true, msg: "Configuración guardada correctamente" };
});

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

let buffer = {
  indice: null,
  mayor: null,
  anular: null,
  menique: null
};

parser.on("data", data => {
  data = data.trim();
  const partes = data.split(":");
  if (partes.length !== 2) return;

  const dedo = partes[0].replace("dedo ", "").trim().toLowerCase();
  const valor = parseInt(partes[1]);

  if (buffer.hasOwnProperty(dedo)) buffer[dedo] = valor;

  const completo =
    buffer.indice !== null &&
    buffer.mayor !== null &&
    buffer.anular !== null &&
    buffer.menique !== null;

  if (!completo) return;
  if (!usuarioActual) return;

  const usuarioConfig = cargarMovimientosDeUsuario(usuarioActual);
  if (!usuarioConfig) return;

  const mov = usuarioConfig.movimientos;

  let dedoFlexionado = null;
  if (buffer.indice > 50) dedoFlexionado = "indice";
  if (buffer.mayor > 50) dedoFlexionado = "mayor";
  if (buffer.anular > 50) dedoFlexionado = "anular";
  if (buffer.menique > 50) dedoFlexionado = "menique";

  if (dedoFlexionado) {
    const accion = mov[dedoFlexionado];
    if (accion) puerto.write(accion + "\n");
  }

  buffer = {
    indice: null,
    mayor: null,
    anular: null,
    menique: null
  };
});

puerto.on("error", err => {
  console.error("Error en el puerto serial:", err.message);
});

startServer(3000);
