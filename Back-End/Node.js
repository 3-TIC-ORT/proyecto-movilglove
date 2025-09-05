import fs from "fs";

let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

function iniciodesesion(usuario,contraseña){
const usuarios = [
{ nombreUsuario: "juan123", contraseña: "1234" },
 { nombreUsuario: "maria22", contraseña: "abcd" }
      ];
    const user = conectar.usuario
    
      if (!user) {
        return "El nombre de usuario no existe";
      }
    
      if (user.contraseña === contraseña) {
        return "Inicio de sesión bien ";
      } else {
        return "Contraseña incorrecta ";
      }
}

console.log(iniciodesesion("juan123", "1234"));


const fs = require("fs");

function registrate(usuario, contraseña) {
 
  if (!fs.existsSync("usuarios.json")) {
    fs.writeFileSync("usuarios.json", "[]", "utf-8");
  }

  let datos = fs.readFileSync("usuarios.json", "utf-8");
  let usuarios = JSON.parse(datos);

  let existeUsuario = usuarios.find(u => u.nombre === usuario);
  if (existeUsuario && existeUsuario.password === contraseña) {
    console.log("⚠️ Ese usuario con esa contraseña ya está registrado.");
    return;
  }
  if (existeUsuario) {
    console.log("⚠️ El nombre de usuario ya existe, elegí otro.");
    return;
  }

  let nuevoUsuario = {
    nombre: usuario,
    password: contraseña
  };

  usuarios.push(nuevoUsuario);

  fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 2), "utf-8");

  console.log("✅ Usuario registrado con éxito!");
}


