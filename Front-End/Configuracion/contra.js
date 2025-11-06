connect2Server(3000);


const selectIndice = document.getElementById("indice");
const selectMedio = document.getElementById("medio");
const selectAnular = document.getElementById("anular");
const selectMenique = document.getElementById("meñique");


const btnGuardar = document.getElementById("guardar");

btnGuardar.addEventListener("click", () => {
  const configuracion = {
    usuario: localStorage["usuario"],
    moivimientos: {
    indice: selectIndice.value,
    medio: selectMedio.value,
    anular: selectAnular.value,
    menique: selectMenique.value
    }
  };


  if (
    configuracion.indice === "--Seleccionar--" ||
    configuracion.medio === "--Seleccionar--" ||
    configuracion.anular === "--Seleccionar--" ||
    configuracion.menique === "--Seleccionar--"
  ) {
    alert("Por favor, seleccioná una acción para cada dedo ");
    return;
  }


  postEvent("guardarConfiguracion", configuracion, (respuesta) => {
    alert(respuesta);
  });
});


//const socket = io();


const indice = document.getElementById("indice");
const medio = document.getElementById("medio");
const anular = document.getElementById("anular");
const meñique = document.getElementById("meñique");
const btnEnviarConfig = document.getElementById("guardar"); 

btnEnviarConfig.addEventListener("click", () => {
  const configuracion = {
    indice: indice.value,
    medio: medio.value,
    anular: anular.value,
    meñique: meñique.value,
  };

  //socket.emit("enviarConfiguracion", configuracion);
  alert("Configuración enviada al Arduino ");
});


