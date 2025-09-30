const input = document.getElementById("contrasena");
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

let andrea = document.getElementById("registro");

andrea.addEventListener("click", () => {
  window.location.href = "../Configuracion/contra.html";
});  


connect2Server(3000);


function registrarUsuario(usuario, contraseña) {
  postEvent("register", { usuario, contraseña }, (resp) => {
    alert(resp.msg); 
  });
}


const inputUsuario = document.getElementById("usuarioRegistro");
const inputContraseña = document.getElementById("contraseñaRegistro");
const btnRegistrar = document.getElementById("btnRegistrar");

btnRegistrar.addEventListener("click", () => {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();
  if (usuario && contraseña) {
    registrarUsuario(usuario, contraseña);
    inputUsuario.value = "";
    inputContraseña.value = "";
  } else {
    alert("Por favor completá todos los campos");
  }
});
