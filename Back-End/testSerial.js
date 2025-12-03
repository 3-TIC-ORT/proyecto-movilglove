import { SerialPort, ReadlineParser } from "serialport";

const puerto = new SerialPort({ path: "COM6", baudRate: 9600 });

const parser = puerto.pipe(new ReadlineParser({ delimiter: "\r\n" }));

puerto.on("open", () => {
  console.log("Puerto serie abierto en COM6");

  // Cada 2 segundos le mando un mensaje al Arduino
  setInterval(() => {
    puerto.write("hola arduino\n", (err) => {
      if (err) {
        console.error("Error al escribir en el puerto serial:", err.message);
      } else {
        console.log("Test enviado al Arduino: hola arduino");
      }
    });
  }, 2000);
});

parser.on("data", (linea) => {
  const data = linea.trim();
  if (data === "") return;
  console.log("Llega desde Arduino:", data);
});

puerto.on("error", (err) => {
  console.error("Error en el puerto serial:", err.message);
});
