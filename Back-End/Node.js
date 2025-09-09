import fs from "fs";

function iniciodesesion(usuario, contraseña) {
  
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

  const user = conectar.find(u => u.usuario === usuario);

  if (!user) {
    return "El nombre de usuario no existe";
  }

  if (user.contraseña === contraseña) {
    return "Inicio de sesión bien";
  } else {
    return "Contraseña incorrecta";
  }
}


console.log(iniciodesesion("juan123", "1234"));

function registrarse(usuario, contraseña) {

  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));


  const existe = conectar.find(u => u.usuario === usuario);
  if (existe) {
    return "El usuario ya existe";
  }


  const nuevoUsuario = { usuario: usuario, contraseña: contraseña };
  conectar.push(nuevoUsuario);

  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");

  return "Usuario registrado correctamente";
}


 console.log(registrarse("hola", "holab"))