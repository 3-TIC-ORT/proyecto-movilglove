Lenny Limonoff
crl+ñ
import fs from "fs";
leer agregar guardar
npm init -y
cd .\Back-End\

import fs from "fs";


andrea.addEventListener("click", () => {
  window.location.href = "../Configuracion/contra.html";
});  

mediuum gustavo machado

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


//movimiento de motor
#define ENA 9
#define ENB 10
#define IN1 3
#define IN2 4
#define IN3 5
#define IN4 6
int velocidad = 200;

//detección de dedos
#define sens1 A0
#define sens2 A1
#define sens3 A2
#define sens4 A3

int dedo1 = 0;
int dedo2 = 0;
int dedo3 = 0;
int dedo4 = 0;

long max = 0;
long min = 1023;
int respuesta = 0;

String orden = "";
 // los flex sensors dan valores entre 535 y 565, asi que vamos a crear una función  que los convierta
 //en porcentaje

int conversor1 (int Valor) {
   respuesta = map(Valor, 470, 950, 0, 100);
  
  if (respuesta < 0) {
    respuesta = 0;
  }
  if (respuesta > 100) {
    respuesta = 100;
  }

  Serial.print ("dedo menique:");
  Serial.println(respuesta);
  return respuesta;
}

int conversor2 (int Valor) {
   respuesta = map(Valor, 470, 950, 0, 100);
  
  if (respuesta < 0) {
    respuesta = 0;
  }
  if (respuesta > 100) {
    respuesta = 100;
  }

  Serial.print ("dedo anular:");
  Serial.println(respuesta);
  return respuesta;
}

int conversor3 (int Valor) {
   respuesta = map(Valor, 470, 950, 0, 100);
  
  if (respuesta < 0) {
    respuesta = 0;
  }
  if (respuesta > 100) {
    respuesta = 100;
  }

  Serial.print ("dedo mayor:");
  Serial.println(respuesta);
  return respuesta;
}

int conversor4 (int Valor) {
   respuesta = map(Valor, 470, 950, 0, 100);

  if (respuesta < 0) {
    respuesta = 0;
  }
  if (respuesta > 100) {
    respuesta = 100;
  }

  Serial.print ("dedo indice:");
  Serial.println(respuesta);
  return respuesta;
}



void setup () {
 //movimiento de motor
 pinMode(3, OUTPUT); 
 pinMode(4,OUTPUT); 
 pinMode(9,OUTPUT);
 pinMode(5,OUTPUT); 
 pinMode(6,OUTPUT); 
 pinMode(10,OUTPUT);
 Serial.begin (9600);
 //detección de dedos
 pinMode(sens1, INPUT);
 pinMode(sens2,INPUT);
 pinMode(sens3,INPUT);
 pinMode(sens4,INPUT);

}

void loop () {
  //detección de dedos:



  dedo1 = analogRead(sens1);
  dedo2 = analogRead(sens2);
  dedo3 = analogRead(sens3);
  dedo4 = analogRead(sens4);
  
//las variables min y max estan ahí porque cada vez que se conecta el sensor otra vez da un rango de valores
//distinto, entonces cada vez que podemos comprobamos esos valores y los usamos para mapear un porcentaje
//de flexión, por ende el input puede ser siempre distinto pero el output siempre va a ser de 0 a 100 

  //los dedos envian por puerto analogico un valor, en cuanto mas alto, mas flexionado el dedo
  //vamos a enviar esos datos al back end quien tiene que interpretarlos y enviar la "orden"
  if(dedo1 > 0) {
    conversor1(dedo1);
  }

  if(dedo2 > 0) {
    conversor2(dedo2);
  }

  if(dedo3 > 0) {
    conversor3(dedo3);
  }

  if(dedo4 > 0) {
    conversor4(dedo4);
  }

  //movimiento de motores:
  //Lo que se va a hacer es mover las ruedas de una u otra forma dependiendo de la orden que llegue
  //desde una computadora por el puerto serie. Cada orden tiene un nombre como "adelante" o 
  //"Derecha"
  
  if (Serial.available () > 0) {
    orden = Serial.readString();
    if (orden == "Adelante") { //los motores tienen que ir a contra-reloj
      digitalWrite(IN1, HIGH);
      digitalWrite(IN2, LOW);
      analogWrite(ENA, velocidad);
      analogWrite(ENB, velocidad);
      digitalWrite(IN3, HIGH);
      digitalWrite(IN4, LOW);
      Serial.println("adelante");
    }
    //ENB está del lado derecho del puente h y ENA está del lado izquierdo (mirando desde el lado donde estan los IN y VCC)
    if (orden == "Izquierda") {
      analogWrite(ENA, 0);
      analogWrite(ENB, velocidad);
      digitalWrite(IN3, HIGH);
      digitalWrite(IN4 , LOW);
      Serial.println("izquierda");
    }

    if (orden == "Derecha") {
      analogWrite(ENB, 0);
      analogWrite(ENA, velocidad);
      digitalWrite(IN1, HIGH);
      digitalWrite(IN2, LOW);
      Serial.println("derecha");
    }

    if (orden == "Atras") {
      analogWrite(ENA, velocidad);
      analogWrite(ENB, velocidad);
      digitalWrite(IN2, HIGH);
      digitalWrite(IN4, HIGH);
      digitalWrite(IN1, LOW);
      digitalWrite(IN3, LOW);
      Serial.println("atras");
    }
    //estos de aca es para que el auto pueda doblar yendo en reversa, es lo mismo que los de derecha e izquierda
    //pero con los IN1 e IN2, IN3 e IN4 invertidos
    if (orden == "Izquierda r") {
      analogWrite(ENA, 0);
      analogWrite(ENB, velocidad);
      digitalWrite(IN3, LOW);
      digitalWrite(IN4 , HIGH);
      Serial.println("izquierda r");
    }
    if (orden == "Derecha r") {
      analogWrite(ENB, 0);
      analogWrite(ENA, velocidad);
      digitalWrite(IN1, LOW);
      digitalWrite(IN2, HIGH);
      Serial.println("derecha r");
    }
    else {
      analogWrite(ENA, 0);
      analogWrite(ENB, 0);
    }
    
  }
  delay(100);
}
//Soy el encargado de escribir este codigo 1 mes luego de haberlo hecho. Recién hoy pude ver si es correcto
//o no... No registra una lectura coherente. ni siquiera se si es un problema de codigo o de hardware,
//lo que si se es que ya ni yo entiendo lo que mi programa hace