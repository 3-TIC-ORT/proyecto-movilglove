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

let configuracionDedos = {};


app.post("/guardarConfiguracion", (req, res) => {
  configuracionDedos = req.body;
  console.log(" Nueva configuración recibida:", configuracionDedos);


  io.emit("configuracionActualizada", configuracionDedos);

  res.json({ mensaje: "Configuración guardada correctamente " });
});


io.on("connection", (socket) => {
  console.log(" Cliente conectado:", socket.id);


  socket.emit("configuracionActualizada", configuracionDedos);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
