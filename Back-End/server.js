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
  const user = lista.find((u) => u.usuario === usuario);
  if (!user) return { success: false, msg: "El nombre de usuario no existe" };
  if (user.contraseña === contraseña)
    return { success: true, msg: "Inicio de sesión correcto" };
  return { success: false, msg: "Contraseña incorrecta" };
}

function registrarse(usuario, contraseña) {
  const lista = cargarUsuarios();
  const existe = lista.find((u) => u.usuario === usuario);
  if (existe) return { success: false, msg: "El usuario ya existe" };
  lista.push({ usuario, contraseña });
  guardarUsuarios(lista);
  return { success: true, msg: "Usuario registrado correctamente" };
}

subscribePOSTEvent("login", (data) =>
  iniciarSesion(data.usuario, data.contraseña)
);
subscribePOSTEvent("register", (data) =>
  registrarse(data.usuario, data.contraseña)
);

let usuarioActual = null;

subscribePOSTEvent("actualizarUsuarioActual", (data) => {
  usuarioActual = data.usuario;
  console.log("Usuario actual:", usuarioActual);
  return { success: true };
});

function cargarMovimientosDeUsuario(usuario) {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    const lista = JSON.parse(contenido);
    return lista.find((u) => u.usuario === usuario) || null;
  } catch {
    return null;
  }
}

subscribePOSTEvent("guardarConfiguracion", (data) => {
  if (!data.usuario)
    return { success: false, msg: "No llegó el usuario desde el front" };
  if (!data.movimientos)
    return { success: false, msg: "No llegaron los movimientos" };

  let movimientos = [];
  if (fs.existsSync("movimientos.json")) {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") movimientos = JSON.parse(contenido);
  }

  const existente = movimientos.find((u) => u.usuario === data.usuario);
  if (existente) {
    existente.movimientos = data.movimientos;
  } else {
    movimientos.push({
      usuario: data.usuario,
      movimientos: data.movimientos,
    });
  }

  fs.writeFileSync(
    "movimientos.json",
    JSON.stringify(movimientos, null, 2),
    "utf-8"
  );

  console.log("Configuración guardada para", data.usuario, data.movimientos);
  return { success: true, msg: "Configuración guardada correctamente" };
});

const puerto = new SerialPort({ path: "COM6", baudRate: 9600 });

puerto.on("open", () => {
  console.log("Puerto serie abierto en COM6");
});

puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});

function enviarAArduino(orden) {
  if (!orden) return;
  puerto.write(orden.toString() + "\n", (err) => {
    if (err) {
      console.error("Error al escribir en el puerto serial:", err.message);
    } else {
      console.log("Orden enviada al Arduino:", orden);
    }
  });
}

// Usamos \r\n porque ya probaste que así anda perfecto con testSerial.js
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let buffer = {
  indice: null,
  medio: null,
  anular: null,
  menique: null,
};

function resetBuffer() {
  buffer = {
    indice: null,
    medio: null,
    anular: null,
    menique: null,
  };
}

function normalizarAccion(accion) {
  if (!accion) return null;
  const a = accion.toLowerCase().trim();
  if (a === "adelante" || a === "avanzar") return "Adelante";
  if (a === "atras" || a === "retroceder") return "Atras";
  if (a === "izquierda") return "Izquierda";
  if (a === "derecha") return "Derecha";
  return null;
}

parser.on("data", (linea) => {
  const data = linea.trim();
  if (data === "") return;

  console.log(data); // lo que manda Arduino

  const partes = data.split(":");
  if (partes.length !== 2) return;

  let dedoNombre = partes[0].trim().toLowerCase();
  let valor = parseInt(partes[1]);

  if (Number.isNaN(valor)) return;

  if (dedoNombre.startsWith("dedo ")) {
    dedoNombre = dedoNombre.slice(5);
  }

  dedoNombre = dedoNombre
    .replace("í", "i")
    .replace("é", "e")
    .replace("ñ", "n")
    .trim();

  if (dedoNombre === "mayor") dedoNombre = "medio";
  if (dedoNombre === "menique") dedoNombre = "menique";

  if (!buffer.hasOwnProperty(dedoNombre)) return;

  buffer[dedoNombre] = valor;

  const completo =
    buffer.indice !== null &&
    buffer.medio !== null &&
    buffer.anular !== null &&
    buffer.menique !== null;

  if (!completo) return;

  console.log("dedo indice:", buffer.indice);
  console.log("dedo medio:", buffer.medio);
  console.log("dedo anular:", buffer.anular);
  console.log("dedo menique:", buffer.menique);

  if (!usuarioActual) {
    console.log("No hay usuarioActual, no mando nada al Arduino");
    resetBuffer();
    return;
  }

  const usuarioConfig = cargarMovimientosDeUsuario(usuarioActual);
  if (!usuarioConfig || !usuarioConfig.movimientos) {
    console.log("No hay configuración de movimientos para", usuarioActual);
    resetBuffer();
    return;
  }

  const mov = usuarioConfig.movimientos;

  const dedos = ["indice", "medio", "anular", "menique"];
  let dedoFlexionado = null;
  let maxValor = -1;

  for (const d of dedos) {
    const v = buffer[d];
    if (v !== null && v > maxValor) {
      maxValor = v;
      dedoFlexionado = d;
    }
  }

  console.log("Dedo con mayor valor:", dedoFlexionado, "=", maxValor);

  const UMBRAL = 50;
  if (maxValor <= UMBRAL) {
    console.log("Ningún dedo supera el umbral, no mando nada");
    resetBuffer();
    return;
  }

  const accionUsuario = mov[dedoFlexionado];
  const ordenArduino = normalizarAccion(accionUsuario);

  console.log("Acción usuario:", accionUsuario);
  console.log("Orden Arduino:", ordenArduino);

  if (ordenArduino) {
    enviarAArduino(ordenArduino);
    console.log("Orden enviada al Arduino:", ordenArduino);
  } else {
    console.log(
      "Acción no reconocida, no mando nada. Acción del usuario:",
      accionUsuario
    );
  }

  resetBuffer();
});

startServer(3000);
