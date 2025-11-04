Lenny Limonoff
crl+ñ
import fs from "fs";
leer agregar guardar
npm init -y
cd .\Back-End\

import fs from "fs";


andrea.addEventListener("click", () => {
  window.location.href = "../Configuracion/contra.html";
});  

mediuum gustavo machado

const botonOjo = document.querySelector(".ojo");
const icono = document.getElementById("iconoOjo");


botonOjo.style.display = "none";

input.addEventListener("input", () => {
  if (input.value.length > 0) {
    botonOjo.style.display = "block";
  } else {
    botonOjo.style.display = "none";
    input.type = "password";           
    icono.classList.remove("fa-eye-slash");
    icono.classList.add("fa-eye");
  }
});


function togglePassword() {
  if (input.type === "password") {
    input.type = "text";                 
    icono.classList.remove("fa-eye");
    icono.classList.add("fa-eye-slash"); 
  } else {
    input.type = "password";            
    icono.classList.remove("fa-eye-slash");
    icono.classList.add("fa-eye");       
  }
}