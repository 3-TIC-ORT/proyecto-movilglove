import { SerialPort, ReadlineParser } from "serialport";
import fs from "fs";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = puerto.pipe(new ReadlineParser({ delimiter: "\n" }));

console.log("Servidor de hardware iniciado. Esperando datos del Arduino...");

function cargarMovimientos() {
  try {
    const contenido = fs.readFileSync("movimientos.json", "utf-8");
    if (contenido.trim() !== "") {
      return JSON.parse(contenido);
    } else {
      return [];
    }
  } catch {
    console.log("No se encontró movimientos.json o está vacío.");
    return [];
  }
}

parser.on("data", (data) => {
  data = data.trim();
  console.log("Dato recibido del Arduino:", data);

  const partes = data.split(":");
  const dedo = partes[0];
  const valor = parseInt(partes[1]);

  const movimientos = cargarMovimientos();
  const configuracion = movimientos.find((m) => m.dedo === dedo);

  if (configuracion) {
    let accion = configuracion.accion;
    if (valor > 300) {
      puerto.write(accion + "\n", (err) => {
        if (err) {
          console.error("Error al enviar al Arduino:", err.message);
        } else {
          console.log("Acción enviada al Arduino:", accion);
        }
      });
    } else {
      console.log("Dedo no lo suficientemente flexionado.");
    }
  } else {
    console.log("No hay acción configurada para este dedo.");
  }
});

puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});
