connect2Server(3000);

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

    console.log("▶ Probando movimientos en Arduino…");

    postEvent("enviarMovimiento", { mov: configuracion.movimientos.indice });
    postEvent("enviarMovimiento", { mov: configuracion.movimientos.medio });
    postEvent("enviarMovimiento", { mov: configuracion.movimientos.anular });
    postEvent("enviarMovimiento", { mov: configuracion.movimientos.menique });

    alert("Se enviaron los movimientos al Arduino para pruebas.");
  });
});
