// --- Conectar con el backend ---
connect2Server(3000);

// --- Capturar los selects ---
const selectIndice = document.getElementById("indice");
const selectMedio = document.getElementById("medio");
const selectAnular = document.getElementById("anular");
const selectMenique = document.getElementById("meñique");

// --- Botón guardar ---
const btnGuardar = document.getElementById("guardar");

btnGuardar.addEventListener("click", () => {
  const configuracion = {
    indice: selectIndice.value,
    medio: selectMedio.value,
    anular: selectAnular.value,
    menique: selectMenique.value
  };

  // Validación: que todos estén seleccionados
  if (
    configuracion.indice === "--Seleccionar--" ||
    configuracion.medio === "--Seleccionar--" ||
    configuracion.anular === "--Seleccionar--" ||
    configuracion.menique === "--Seleccionar--"
  ) {
    alert("Por favor, seleccioná una acción para cada dedo 🖐️");
    return;
  }

  // Enviar configuración al backend
  postEvent("guardarConfiguracion", configuracion, (respuesta) => {
    alert(respuesta);
  });
});


