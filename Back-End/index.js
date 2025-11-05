import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";
import { SerialPort } from "serialport";

const puerto = new SerialPort({ path: "COM3", baudRate: 9600 });

subscribePOSTEvent("guardarMovimientos", (data) => {
  try {

    const movimientos = {
      indice: data.indice || "",
      medio: data.medio || "",
      anular: data.anular || "",
      meñique: data.meñique || ""
    };

    fs.writeFileSync("movimientos.json", JSON.stringify(movimientos, null, 2), "utf-8");
    console.log(" Movimientos guardados:", movimientos);

    puerto.write(JSON.stringify(movimientos) + "\n");
    console.log(" Datos enviados al Arduino");

    return { success: true, msg: "Configuración guardada correctamente" };

  } catch (error) {
    console.error(" Error al guardar movimientos:", error);
    return { success: false, msg: "Error al guardar la configuración" };
  }
});

startServer(3000, true);
console.log("Servidor iniciado en el puerto 3000 y conectado al Arduino en COM3");
