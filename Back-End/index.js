import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

let configuracionDedos = {}; // acá se guardará la configuración enviada desde el front

// Endpoint para guardar configuración
app.post("/guardarConfiguracion", (req, res) => {
  configuracionDedos = req.body;
  console.log("🖐️ Nueva configuración recibida:", configuracionDedos);

  // Enviar a todos los clientes conectados por socket
  io.emit("configuracionActualizada", configuracionDedos);

  res.json({ mensaje: "Configuración guardada correctamente ✅" });
});

// Socket: conexión en tiempo real
io.on("connection", (socket) => {
  console.log("🧠 Cliente conectado:", socket.id);

  // Enviar configuración actual al cliente nuevo
  socket.emit("configuracionActualizada", configuracionDedos);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
