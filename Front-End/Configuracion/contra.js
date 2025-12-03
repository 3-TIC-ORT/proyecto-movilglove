connect2Server(3000);

const usuario = localStorage.getItem("usuario");

if (usuario) {
  postEvent("actualizarUsuarioActual", { usuario }, (respuesta) => {
    console.log("Usuario actual seteado en el backend:", usuario, respuesta);
  });
} else {
  console.warn("No hay usuario en localStorage, no se pudo actualizar usuarioActual");
}

const selectIndice = document.getElementById("indice");
const selectMedio = document.getElementById("medio");
const selectAnular = document.getElementById("anular");
const selectMenique = document.getElementById("meñique");

const btnGuardar = document.getElementById("guardar");

btnGuardar.addEventListener("click", () => {
  const configuracion = {
    usuario: localStorage.getItem("usuario"),
    movimientos: {
      indice: selectIndice.value,
      medio: selectMedio.value,
      anular: selectAnular.value,
      menique: selectMenique.value,
    },
  };

  if (
    configuracion.movimientos.indice === "--Seleccionar--" ||
    configuracion.movimientos.medio === "--Seleccionar--" ||
    configuracion.movimientos.anular === "--Seleccionar--" ||
    configuracion.movimientos.menique === "--Seleccionar--"
  ) {
    alert("Por favor, seleccioná una acción para cada dedo.");
    return;
  }

  postEvent("guardarConfiguracion", configuracion, (respuesta) => {
    alert(respuesta.msg || respuesta);
  });
});
