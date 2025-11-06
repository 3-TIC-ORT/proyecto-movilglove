import fs from "fs";

export function iniciodesesion(data) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  const user = conectar.find(u => u.usuario === data.usuario);

  if (!user) {
    return { success: false, msg: "El nombre de usuario no existe" };
  }

  if (user.contraseña === data.contraseña) {
    return { success: true, msg: "Inicio de sesión correcto" };
  } else {
    return { success: false, msg: "Contraseña incorrecta" };
  }
}

export function registrarse(data) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

  const existe = conectar.find(u => u.usuario === data.usuario);
  if (existe) {
    return { success: false, msg: "El usuario ya existe" };
  }

  const nuevoUsuario = {"usuario": data.usuario, "contraseña": data.contraseña };
  conectar.push(nuevoUsuario);

  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");

  return { success: true, msg: "Usuario registrado correctamente" };
}

     