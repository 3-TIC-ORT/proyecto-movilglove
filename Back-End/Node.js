import fs from "fs";

function iniciodesesion(usuario,contraseña){
    const usuarios = [
        { nombreUsuario: "juan123", contraseña: "1234" },
        { nombreUsuario: "maria22", contraseña: "abcd" }
      ];
    
      // Buscar si existe el usuario
      const user = usuarios.find(u => u.nombreUsuario === nombreUsuario);
    
      if (!user) {
        return "El nombre de usuario no existe ❌";
      }
    
      if (user.contraseña === contraseña) {
        return "Inicio de sesión exitoso ✅";
      } else {
        return "Contraseña incorrecta ❌";
      }
}

console.log(iniciodesesion("juan123", "1234"));


function registrate(usuario,contraseña){

}

