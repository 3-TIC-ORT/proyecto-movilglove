const input = document.getElementById("contrasena");
const botonOjo = document.querySelector(".ojo");
const icono = document.getElementById("iconoOjo");

botonOjo.style.display = "none";

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

// 🔗 Conectamos al servidor
connect2Server(3000);

// 🧩 Función principal de inicio de sesión
function iniciarSesion(usuario, contraseña) {
  postEvent("login", { usuario, contraseña }, (resp) => {
    try {
      if (typeof resp === "string") resp = JSON.parse(resp);
    } catch (err) {
      console.error("Error al parsear la respuesta:", err);
      alert("Error inesperado del servidor");
      return;
    }

    // ✅ Mostramos el mensaje que viene del servidor
    alert(resp.msg);

    // 🚀 Si el inicio fue correcto, redirige al archivo de configuración
    if (resp.success) {
      window.location.href = "../Configuracion/contra.html";
    }
  });
}

// 📋 Elementos del formulario
const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("contrasena");
const btnIniciar = document.getElementById("iniciocesion");

// 🧠 Evento del botón
btnIniciar.addEventListener("click", () => {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();

  if (usuario && contraseña) {
    iniciarSesion(usuario, contraseña);
  } else {
    alert("Por favor completá todos los campos");
  }
});
