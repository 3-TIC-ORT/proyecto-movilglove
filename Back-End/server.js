import { SerialPort } from 'serialport';

import { subscribePOSTEvent, startServer } from 'soquetic';


const puerto = new SerialPort({ path: 'COM6', baudRate: 9600 });


subscribePOSTEvent('guardarConfiguracion', (data) => {
  console.log('Configuración recibida:', data);
  
  puerto.write(data, (err) => {
    if (err) {
      console.log('Error al enviar datos al Arduino:', err.message);
    } else {
      console.log('Datos enviados al Arduino correctamente.');
    }
  });
});


startServer(3000, true);
