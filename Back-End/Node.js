import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";

function iniciodesesion(usuario, contraseña) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  const user = conectar.find(u => u.usuario === usuario);

  if (!user) {
    return { success: false, msg: "El nombre de usuario no existe" };
  }

  if (user.contraseña === contraseña) {
    return { success: true, msg: "Inicio de sesión correcto" };
  } else {
    return { success: false, msg: "Contraseña incorrecta" };
  }
}

function registrarse(usuario, contraseña) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

  const existe = conectar.find(u => u.usuario === usuario);
  if (existe) {
    return { success: false, msg: "El usuario ya existe" };
  }

  const nuevoUsuario = { usuario, contraseña };
  conectar.push(nuevoUsuario);

  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");

  return { success: true, msg: "Usuario registrado correctamente" };
}

subscribePOSTEvent("login", (data) => {
  return iniciodesesion(data.usuario, data.contraseña);
});

subscribePOSTEvent("register", (data) => {
  return registrarse(data.usuario, data.contraseña);
});

startServer(3000, true);
     