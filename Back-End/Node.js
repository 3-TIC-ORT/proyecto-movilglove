import fs from "fs";

let conectar = JSON.parse(fs.readFileSync("usuario.json", "utf-8"));

function iniciodesesion(usuario,contraseña){
const usuarios = [
{ nombreUsuario: "juan123", contraseña: "1234" },
 { nombreUsuario: "maria22", contraseña: "abcd" }
      ];
    const user = usuarios.find(u => u.nombreUsuario === nombreUsuario);
    
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


function registrate(usuario,contraseña){

}

