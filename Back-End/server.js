import { startServer, subscribePOSTEvent } from "soquetic";
import fs from "fs";
import { SerialPort, ReadlineParser } from "serialport";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log(" Servidor de hardware iniciado. Esperando datos del Arduino...");

let usuarioActual = null;

subscribePOSTEvent("actualizarUsuarioActual", (data) => {
  usuarioActual = data.usuario;
  console.log("👤 Usuario actual:", usuarioActual);
  return { success: true };
});

function cargarMovimientosDeUsuario(usuario) {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    const lista = JSON.parse(contenido);

    return lista.find((u) => u.usuario === usuario);
  } catch {
    return null;
  }
}

subscribePOSTEvent("guardarConfiguracion", (data) => {
  if (!data.usuario) {
    return { success: false, msg: "No llegó el usuario desde el front" };
  }

  if (!data.movimientos) {
    return { success: false, msg: "No llegaron los movimientos" };
  }

  let movimientos = [];

  if (fs.existsSync("movimientos.json")) {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") {
      movimientos = JSON.parse(contenido);
    }
  }

  const existente = movimientos.find((u) => u.usuario === data.usuario);

  if (existente) {
    existente.movimientos = data.movimientos;
  } else {
    movimientos.push(data);
  }

  fs.writeFileSync(
    "movimientos.json",
    JSON.stringify(movimientos, null, 2),
    "utf-8"
  );

  console.log("💾 Configuración guardada para:", data.usuario);

  return { success: true, msg: "Configuración guardada correctamente" };
});


// ✔ buffer corregido (incluye el dedo “mayor” en vez de “medio”)
let buffer = {
  indice: null,
  mayor: null,
  anular: null,
  menique: null,
};

parser.on("data", (data) => {
  data = data.trim();

  const [dedo, valor] = data.split(":");
  const dedoLimpio = dedo.replace("dedo ", "").trim().toLowerCase();
  const numero = parseInt(valor);

  console.log("Dedo:", dedoLimpio);
  console.log("Valor:", numero);

  if (buffer.hasOwnProperty(dedoLimpio)) {
    buffer[dedoLimpio] = numero;
  }

  console.log("buffer:", buffer);

  // ✔ SOLO procesar si todos los dedos recibieron al menos un número
  const completo =
    buffer.indice !== null &&
    buffer.mayor !== null &&
    buffer.anular !== null &&
    buffer.menique !== null;

  if (!completo) return;

  if (!usuarioActual) {
    console.log("⚠ No hay usuario logueado, ignorando datos...");
    return;
  }

  const usuarioConfig = cargarMovimientosDeUsuario(usuarioActual);

  if (!usuarioConfig) {
    console.log("❗ El usuario NO tiene movimientos configurados");
    return;
  }

  const mov = usuarioConfig.movimientos;

  let dedoFlexionado = null;

  // ✔ nombre corregido: “mayor”
  if (buffer.indice > 50) dedoFlexionado = "indice";
  if (buffer.mayor > 50) dedoFlexionado = "mayor";
  if (buffer.anular > 50) dedoFlexionado = "anular";
  if (buffer.menique > 50) dedoFlexionado = "menique";

  if (!dedoFlexionado) {
    console.log(" Ningún dedo flexionado");
  } else {
    const accion = mov[dedoFlexionado];

    if (accion) {
      puerto.write(accion + "\n");
      console.log("✔ Acción enviada:", accion);
    } else {
      console.log(" No hay acción configurada para ese dedo");
    }
  }

  // ✔ reiniciar buffer para la próxima lectura
  buffer = {
    indice: null,
    mayor: null,
    anular: null,
    menique: null,
  };
});

puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});

startServer(3000);
console.log("Backend iniciado en puerto 3000");
