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
 