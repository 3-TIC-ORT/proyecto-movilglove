import { startServer, subscribePOSTEvent } from "soquetic";
import fs from "fs";
import { SerialPort, ReadlineParser } from "serialport";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log("🔥 Servidor hardware iniciado. Esperando datos del Arduino...");

// -------------------------------
// USUARIO ACTUAL
// -------------------------------
let usuarioActual = null;

subscribePOSTEvent("actualizarUsuarioActual", (data) => {
  usuarioActual = data.usuario;
  console.log("👤 Usuario actual:", usuarioActual);
  return { success: true };
});

// -------------------------------
// CARGAR CONFIG DEL USUARIO
// -------------------------------
function cargarMovimientosDeUsuario(usuario) {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    const lista = JSON.parse(contenido);
    return lista.find((u) => u.usuario === usuario);
  } catch {
    return null;
  }
}

// -------------------------------
// GUARDAR CONFIGURACIÓN
// -------------------------------
subscribePOSTEvent("guardarConfiguracion", (data) => {
  if (!data.usuario) return { success: false, msg: "No llegó el usuario" };
  if (!data.movimientos) return { success: false, msg: "No llegaron movimientos" };

  let movimientos = [];

  if (fs.existsSync("movimientos.json")) {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") movimientos = JSON.parse(contenido);
  }

  const existente = movimientos.find((u) => u.usuario === data.usuario);

  if (existente) {
    existente.movimientos = data.movimientos;
  } else {
    movimientos.push(data);
  }

  fs.writeFileSync("movimientos.json", JSON.stringify(movimientos, null, 2));

  console.log("💾 Configuración guardada para:", data.usuario);
  return { success: true, msg: "Guardado OK" };
});

// -------------------------------
// ENVIAR MOVIMIENTO MANUAL AL ARDUINO
// -------------------------------
subscribePOSTEvent("enviarMovimiento", (data) => {
  if (!data.mov) {
    return { success: false, msg: "No llegó movimiento" };
  }

  puerto.write(data.mov + "\n");
  console.log("➡️ Enviado al Arduino:", data.mov);

  return { success: true, msg: "Movimiento enviado al Arduino" };
});

// -------------------------------
// BUFFER PARA DEDOS DEL GUANTE
// -------------------------------
let buffer = {
  indice: null,
  medio: null,   // ← acá corregido
  anular: null,
  menique: null,
};

parser.on("data", (data) => {
  data = data.trim();

  const [dedo, valor] = data.split(":");
  let dedoLimpio = dedo.replace("dedo ", "").trim().toLowerCase();

  // Normalizar
  if (dedoLimpio === "mayor") dedoLimpio = "medio";

  const numero = parseInt(valor);

  if (buffer.hasOwnProperty(dedoLimpio)) buffer[dedoLimpio] = numero;

  const completo =
    buffer.indice !== null &&
    buffer.medio !== null &&
    buffer.anular !== null &&
    buffer.menique !== null;

  if (!completo) return;

  if (!usuarioActual) {
    console.log("⚠ No hay usuario logueado");
    buffer = { indice: null, medio: null, anular: null, menique: null };
    return;
  }

  const usuarioConfig = cargarMovimientosDeUsuario(usuarioActual);

  if (!usuarioConfig) {
    console.log("❗ El usuario NO tiene configuraciones");
    buffer = { indice: null, medio: null, anular: null, menique: null };
    return;
  }

  const mov = usuarioConfig.movimientos;

  let dedoFlexionado = null;

  if (buffer.indice > 50) dedoFlexionado = "indice";
  if (buffer.medio > 50) dedoFlexionado = "medio";
  if (buffer.anular > 50) dedoFlexionado = "anular";
  if (buffer.menique > 50) dedoFlexionado = "menique";

  if (dedoFlexionado) {
    const accion = mov[dedoFlexionado];
    if (accion) {
      puerto.write(accion + "\n");
      console.log("✔ Acción enviada desde guante:", accion);
    }
  }

  buffer = { indice: null, medio: null, anular: null, menique: null };
});

puerto.on("error", (err) => {
  console.error("❌ Error serial:", err.message);
});

startServer(3000);
console.log("🚀 Backend andando en puerto 3000");
