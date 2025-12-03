import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";
import { SerialPort, ReadlineParser } from "serialport";
import { prototype } from "events";

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

const port = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

port.on("open", () => {
  console.log("Puerto serial abierto");
});


function enviarAArduino(comando) {
  port.write(comando.toString() + "\n");
}


function medicion({ Tipo }) {
  if (Tipo === "humedad") enviarAArduino("RH");
  else if (Tipo === "temperatura") enviarAArduino("RT");
  else if (Tipo === "luz") enviarAArduino("RL");
  else if (Tipo === "sonido") enviarAArduino("RM");
  else console.log("Tipo de medición no reconocido");
}


function movimiento({ direccion }) {
  if (direccion === "adelante") enviarAArduino("W");
  else if (direccion === "atras") enviarAArduino("S");
  else if (direccion === "derecha") enviarAArduino("D");
  else if (direccion === "izquierda") enviarAArduino("A");
  else if (direccion === "frenar") enviarAArduino("X");
  else console.log("Dirección no reconocida");
}


subscribePOSTEvent("medir", medicion);
subscribePOSTEvent("movimiento", movimiento);

parser.on("data", (data) => {
  const tipo = data.substring(0, 2);
  const valor = data.substring(2);

  if (tipo === "RL") realTimeEvent("nuevasLuces", { tipo, valor });
  else if (tipo === "RH") realTimeEvent("nuevasHumedades", { tipo, valor });
  else if (tipo === "RM") realTimeEvent("nuevosSonidos", { tipo, valor });
  else if (tipo === "RT") realTimeEvent("nuevasTemperaturas", { tipo, valor });

  let devoluciones = [];
  if (fs.existsSync("datos.json")) {
    devoluciones = JSON.parse(fs.readFileSync("datos.json", "utf-8"));
  }

  devoluciones.push({ tipo, valor });
  fs.writeFileSync("datos.json", JSON.stringify(devoluciones, null, 2));
});

port.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});
