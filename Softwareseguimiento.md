Lenny Limonoff
crl+ñ
import fs from "fs";
leer agregar guardar
npm init -y
cd .\Back-End\

import fs from "fs";


function iniciodesesion(usuario, contraseña) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

  let user = "";

  for (let i = 0; i < conectar.length; i++) {
    if (conectar[i].usuario === usuario) {
      user = conectar[i]; 
      break;        
    }
  }

  if (!user) {
    return "El nombre de usuario no existe";
  }

  if (user.contraseña === contraseña) {
    return "Inicio de sesión correcto";
  } else {
    return "Contraseña incorrecta";
  }
}


console.log(iniciodesesion("juan123", "1234"));

function registrarse(usuario, contraseña) {
  let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));
  for (let i= 0; i < usuario.length; i++){
  if (existe) 
    return "El usuario ya existe";
}
  const nuevoUsuario = { usuario: usuario, contraseña: contraseña };
  conectar.push(nuevoUsuario);

  fs.writeFileSync("usuario.json", JSON.stringify(conectar, null, 2), "utf-8");

  return "Usuario registrado correctamente";
}


 console.log(registrarse("hola", "holab"))

