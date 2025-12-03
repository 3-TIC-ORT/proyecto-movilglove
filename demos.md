import { ReadlineParser, SerialPort } from 'serialport';
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import fs from "fs";
// Create a port
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600,
});
 
port.on("open",()=>{
    console.log("Hola")
});

//Conexion con Hardware
function enviarAArduino(mandar){
    port.write(mandar.toString() + "\n")
}; // Enviar info al arduino


function medicion({Tipo}) {
  if (Tipo === "humedad") {
    enviarAArduino("RH");
  } else if (Tipo === "temperatura") {
    enviarAArduino("RT");
  } else if (Tipo === "luz") {
    enviarAArduino("RL");
  } else if (Tipo === "sonido") {
    enviarAArduino("RM");
  } else {
    console.log("error");
  }
}


 function movimiento({direccion}){
  if (direccion === "adelante") {
    enviarAArduino("W")
  }
  if (direccion === "atras") {
    enviarAArduino("S")
  }

  if (direccion === "derecha") {
    enviarAArduino("D")
  }
  if (direccion === "izquierda") {
    enviarAArduino("A")
  }
  if (direccion === "frenar") {
    enviarAArduino("X")
  }
  else {
    console.log("error")
  };
 };
subscribePOSTEvent("medir", medicion);
subscribePOSTEvent("movimiento", movimiento);
const lectura = port.pipe(new ReadlineParser({ delimiter: '\r\n' })) //Leer info de arduino
lectura.on('data', (data) => {
  // Aca va todo el HW
  let tipo = data.substring(0, 2);
  let valor = data.substring(2, );
  if (tipo==="RL") {
    realTimeEvent("nuevasLuces", {tipo,valor})
  }
  if (tipo==="RH") {
    realTimeEvent("nuevasHumedades", {tipo,valor})
  }
  if (tipo==="RM") {
    realTimeEvent("nuevosSonidos", {tipo,valor})
  }
  if (tipo==="RT") {
    realTimeEvent("nuevasTemperaturas", {tipo,valor})
  }
 
  let devoluciones = JSON.parse(fs.readFileSync("datosprueba.json", "utf-8"));
      devoluciones.push({tipo, valor})
    let devolucion = JSON.stringify(devoluciones, null, 2);
    fs.writeFileSync("datosprueba.json", devolucion);
   return {ok:true};
});


startServer()



//Cambiar el JSON donde se guardan los datos (datosprueba.json ---> datos.json)
//Probar con el arduino posta 
 

 ciedno un prroyecto el cual tiene un guante, el cual vos te lo pones y mediante el movimiento de los dedos, Anular, el del medio, el meñique y el índice el auto se mueve, para la izquierda, derecha, avanzar y retroceder. Yo tengo una pantalla de mi página web la cual hace que vos configures esos movimientos mediante un select invisible en cada dedo que cada uno dice izquierda, derecha, avanzar y retroceder entoces cuando vos toques uno de esos lo que va a hacer es mandarlselo al back-end mediante un boton que dice guardar. Obviamente, mi proyecto tiene una parte de iniciar sesion y registarrse para que vos guardes esos movimientos. Yo tengo el codigo de conexion con el arduino pero tengo unos errores que necesito que vos me corrijas. Mi arduino me va a mandar a mi estas acciones:
 los sensores ya funcionan e imprimen un valor entre 0 y 100 

Así que hacé lo siguiente:

Sensor < 50: false

Sensor > 50: true

Siendo true y false si el dedo está o no flexionado
Eso por cada uno de los 4 dedos
Así que si te aparece (por ejemplo):

Índice: 20

Mayor: 70

Anular: 10

Meñique: 45

El que está siendo flexionado es el MAYOR
PERO ESTO ES LO QUE VA A PASAR:
El Arduino tiene ciclos de 200ms (creo) Por cada ciclo, va a enviar los datos de los dedos una vez Índice: x Mayor: x Anular: x Meñique: x Entonces vas a tener datos nuevos de los sensores cada 200ms Por cada tanda de datos vos tenés que hacer lo siguiente: -Recibir las lecturas de los dedos por puerto serie -Entender según la configuración del usuario que significa ese dedo que está siendo flexionado en ese momento -Enviar esa orden al Arduino, ya sea Avanzar Derecha Izquierda Retroceder
yo ahora te voy a mandar algunas cosas para que vos entiendas mi codigo, me lo corrijas y asi ya puedo tener mi codigo final.
Las cosas que te voy a mandar son:
una explicacion de mi codigo de la conexion frontend-Backend la cual es una biblioteca, y te voy a mandar mi codigo del arrduino que ese no lo podes cambiar, y mi codigo BACK-END QUE ES EL QUE TENES QUE CORRREGIR. A MI SOLO ME FALTA CORREGIR EL CODIGO BACK-END PARA QUE LE LLEGUEN LAS ACCIONES AL ARDUINO, QUE ESO ES EN LO QUE ME TENES QUE AYUDAR