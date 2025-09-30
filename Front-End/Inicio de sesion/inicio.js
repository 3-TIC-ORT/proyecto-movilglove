const input = document.getElementById("contraseña");
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

let inicio = document.getElementById("iniciocesion");

inicio.addEventListener("click", () => {
  window.location.href = "../Configuracion/contra.html";
});  


connect2Server(3000);

function iniciarSesion(usuario, contraseña) {
  postEvent("login", { usuario, contraseña }, (resp) => {
    alert(resp.msg); 
    if (resp.success) {
      
      console.log("Usuario logueado correctamente");
    }
  });
}


const inputUsuario = document.getElementById("usuarioLogin");
const inputContraseña = document.getElementById("contraseñaLogin");
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", () => {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();
  if (usuario && contraseña) {
    iniciarSesion(usuario, contraseña);
    inputUsuario.value = "";
    inputContraseña.value = "";
  } else {
    alert("Por favor completá todos los campos");
  }
});
