import { SerialPort, ReadlineParser } from "serialport";
import fs from "fs";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log("Servidor de hardware iniciado. Esperando datos...");

let buffer = {
  indice: null,
  medio: null,
  anular: null,
  meñique: null
};

function cargarMovimientos() {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") return JSON.parse(contenido);
    return [];
  } catch {
    return [];
  }
}

parser.on("data", (data) => {
  data = data.trim();
  const partes = data.split(":");
  const dedo = partes[0].toLowerCase();
  const valor = parseInt(partes[1]);

  if (buffer.hasOwnProperty(dedo)) {
    buffer[dedo] = valor;
  }

  const completo =
    buffer.indice !== null &&
    buffer.medio !== null &&
    buffer.anular !== null &&
    buffer.meñique !== null;

  if (completo) {
    let dedoFlexionado = null;

    if (buffer.indice > 50) dedoFlexionado = "indice";
    if (buffer.medio > 50) dedoFlexionado = "medio";
    if (buffer.anular > 50) dedoFlexionado = "anular";
    if (buffer.meñique > 50) dedoFlexionado = "meñique";

    if (dedoFlexionado) {
      const movimientos = cargarMovimientos();
      const config = movimientos.find((m) => m.dedo === dedoFlexionado);

      if (config) {
        puerto.write(config.accion + "\n");
        console.log("Acción enviada:", config.accion);
      } else {
        console.log("No hay acción configurada para:", dedoFlexionado);
      }
    } else {
      console.log("Ningún dedo flexionado.");
    }

    buffer.indice = null;
    buffer.medio = null;
    buffer.anular = null;
    buffer.meñique = null;
  }
});

puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});
