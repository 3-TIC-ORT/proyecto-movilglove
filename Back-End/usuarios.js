import { SerialPort, ReadlineParser } from "serialport";
import fs from "fs";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log("Servidor de hardware iniciado. Esperando datos...");

const usuarioActual = "Lenny";

function cargarMovimientosDeUsuario() {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    const lista = JSON.parse(contenido);

    return lista.find((u) => u.usuario === usuarioActual);
  } catch {
    return null;
  }
}

// --------------------------
//  BUFFER TEMPORAL
// --------------------------
let buffer = {
  indice: null,
  medio: null,
  anular: null,
  menique: null,
};

// --------------------------
//  LECTURA SERIAL
// --------------------------
parser.on("data", (data) => {
  data = data.trim();

  const [dedo, valor] = data.split(":");
  const dedoLower = dedo.toLowerCase();
  const numero = parseInt(valor);

  if (buffer.hasOwnProperty(dedoLower)) {
    buffer[dedoLower] = numero;
  }

  const completo =
    buffer.indice !== null &&
    buffer.medio !== null &&
    buffer.anular !== null &&
    buffer.menique !== null;

  if (completo) {
    let dedoFlexionado = null;

    if (buffer.indice > 50) dedoFlexionado = "indice";
    if (buffer.medio > 50) dedoFlexionado = "medio";
    if (buffer.anular > 50) dedoFlexionado = "anular";
    if (buffer.menique > 50) dedoFlexionado = "menique";

    const usuarioConfig = cargarMovimientosDeUsuario();

    if (!usuarioConfig) {
      console.log("❌ Usuario no encontrado en movimientos.json");
      return;
    }

    const movimientos = usuarioConfig.movimientos;

    if (dedoFlexionado) {
      const accion = movimientos[dedoFlexionado];

      if (accion) {
        puerto.write(accion + "\n");
        console.log("✔ Acción enviada:", accion);
      } else {
        console.log("❌ No hay acción para ese dedo en este usuario.");
      }
    } else {
      console.log("Ningún dedo flexionado.");
    }

    // Reiniciar buffer
    buffer = {
      indice: null,
      medio: null,
      anular: null,
      menique: null,
    };
  }
});


puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});
