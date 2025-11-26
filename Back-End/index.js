import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";
import { SerialPort } from "serialport";

 const puerto = new SerialPort({ path: "COM4", baudRate: 9600 });

export function guardarMovimientos(data) {
  try {
    let movimientos = [];

    if (fs.existsSync("movimientos.json")) {
      const contenido = fs.readFileSync("movimientos.json", "utf-8");
      if (contenido.trim() !== "") {
        movimientos = JSON.parse(contenido);
      }
    }

    if (!Array.isArray(movimientos)) {
      movimientos = [movimientos];
    }

    movimientos.push(data);

    fs.writeFileSync("movimientos.json", JSON.stringify(movimientos, null, 2), "utf-8");
    console.log(" Movimientos guardados:", data);

   puerto.write(JSON.stringify(movimientos) + "\n");
    console.log(" Datos enviados al Arduino");

    return { success: true, msg: "Configuración guardada correctamente" };

  } catch (error) {
    console.error(" Error al guardar movimientos:", error);
    return { success: false, msg: "Error al guardar la configuración" };
  }
};
