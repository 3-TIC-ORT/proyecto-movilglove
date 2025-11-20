const input = document.getElementById("contrasena");
const botonOjo = document.querySelector(".ojo");
const icono = document.getElementById("iconoOjo");




connect2Server(3000);


function iniciarSesion(usuario, contraseña) {
  postEvent("login", { usuario, contraseña }, (resp) => {
    try {
      if (typeof resp === "string") resp = JSON.parse(resp);
    } catch (err) {
      console.error("Error al parsear la respuesta:", err);
      alert("Error inesperado del servidor");
      return;
    }


    alert(resp.msg);

    
    if (resp.success) {
      localStorage.setItem("usuario", usuario);
      window.location.href = "../Configuracion/contra.html";
    }
  });
}


const inputUsuario = document.getElementById("usuario");
const inputContraseña = document.getElementById("contrasena");
const btnIniciar = document.getElementById("iniciocesion");


btnIniciar.addEventListener("click", () => {
  const usuario = inputUsuario.value.trim();
  const contraseña = inputContraseña.value.trim();

  if (usuario && contraseña) {
    iniciarSesion(usuario, contraseña);
  } else {
    alert("Por favor completá todos los campos");
  }
});

postEvent("actualizarUsuarioActual", { usuario });
