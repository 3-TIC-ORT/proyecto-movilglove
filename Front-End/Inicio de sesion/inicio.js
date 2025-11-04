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



connect2Server(3000);


function iniciarSesion(usuario, contraseña) {
  postEvent("login", { usuario, contraseña }, (resp) => {
    alert(resp.msg);

    if (resp.success) {
      window.location.href = "../Configuracion/contra.html";
    }
  });
}


const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("contrasena");
const btnIniciar = document.getElementById("iniciar");

btnIniciar.addEventListener("click", () => {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();

  if (usuario && contraseña) {
    iniciarSesion(usuario, contraseña);
  } else {
    alert("Por favor completá todos los campos");
  }
});
