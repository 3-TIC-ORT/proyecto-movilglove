#define velocidad 200
#define dedo0 A0
#define dedo1 A1
#define dedo2 A2
#define dedo3 A3
#define in1 3
#define in2 4
#define in3 5
#define in4 6
#define ENA 9
#define ENB 10

//Este contador se usa para frenar el auto si no llega ninguna orden de la computadora durante 200ms
unsigned long ultimaOrden = 0;
const unsigned long timeout_freno = 100;

// Siempre llamar limpiarOut() antes de prenderMotor()
// para garantizar que el pin complementario esté en LOW
void prenderMotor (int pin)
{
 if (pin == in1 || pin == in2)//los pines in1 e in2 son habilitados solo por ENA y pertenecen al motor 1
 {
  analogWrite(ENA , velocidad);
  digitalWrite(pin, HIGH);
  Serial.print("Activando el pin ");
  Serial.println(pin);
 } 

 if (pin == in3 pin == in4)//los pines in3 e in4 son habilitados solo por ENB y pertenecen al motor 2
 {
  analogWrite(ENB, velocidad);
  digitalWrite(pin, HIGH);
  Serial.print("Activando el pin ");
  Serial.println(pin);
 }
}

void apagarMotor (int pin)
{
  //realmente, esta función no es necesaria ya que ahora añadí limpiarOut, pero bue, quedará.
 if (pin == 3 || pin == 4) 
 {
  analogWrite(ENA, 0);
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
 }
    

 if(pin == 5 || pin == 6) 
 {
  analogWrite(ENB, 0);
  digitalWrite(in3, LOW);
  digitalWrite(in4, LOW);
 }
}

void lector(int Puerto, const char* dedo)
{
  /*
  La información debe ser entregada en este formato específico (ej: indice: 50) para que el back-end lo
  entienda. Por eso se pide un string con el texto del dedo, aunque no sea importante para leerlo
  */
  Serial.print(dedo); 
  Serial.print(":");
  Serial.println(map(analogRead(Puerto), 4, 500, 0, 100));//Una vez montado en el guante, el máximo que registra un potenciometro es alrededor de 500, no llega a los 230 grados completo 
}
void limpiarOut() 
{
 /*
  LimpiarOut() es una función que, por seguridad, apaga todos los pines
  del puente h. debe ser llamada antes de prender cualquier pin para 
  evitar que un pin quede flotando con la orden anterior que recibió.
  no es lo mismo que apagarMotor(pin) ya que ese desactiva ambos pines
  de un motor y su habilitador.
*/
 analogWrite(ENA, 0);
 analogWrite(ENB, 0);
 digitalWrite(in1, LOW);
 digitalWrite(in2, LOW);
 digitalWrite(in3, LOW);
 digitalWrite(in4, LOW);
}

void setup() 
{
 Serial.begin(9600);
 Serial.setTimeout(10);
 pinMode(3, OUTPUT); 
 pinMode(4,OUTPUT); 
 pinMode(9,OUTPUT);
 pinMode(5,OUTPUT); 
 pinMode(6,OUTPUT); 
 pinMode(10,OUTPUT);
}

void loop() 
{
   //Detección de dedos
   lector(dedo0, "indice");
   lector(dedo1, "mayor");
   lector(dedo2, "anular");
   lector(dedo3, "meñique");

   //Movimiento del auto
 if(Serial.available() > 0){
   String orden = Serial.readStringUntil('\n');

   if(orden == "Adelante"){
    Serial.println("Orden adelante recibida");
    limpiarOut();
    prenderMotor(in1);
    prenderMotor(in3);
   }

   if(orden == "Atras"){
   Serial.println("Orden atras recibida");
    limpiarOut();
    prenderMotor(in2);
    prenderMotor(in4);
   }
   //Para girar hacia los lados, el auto activa el motor del lado opuesto
   //al de la oden en sentido horario (adelante) y prende el otro motor
   //en sentido antihorario (atras)
   if(orden == "Izquierda"){
   Serial.println("Orden izquierda recibida");
    limpiarOut();
    prenderMotor(in2); //motor 1 atras
    prenderMotor(in3); //motor 2 adelante
   }

   if(orden == "Derecha"){
    Serial.println("Orden derecha recibida");
    limpiarOut();
    prenderMotor(in1); //motor 1 adelante
    prenderMotor(in4); //motor 2 atras
   }

   ultimaOrden = millis();// <---- se reinicia el contador de "hace cuanto se recibió la ultima orden"
 }
 if (millis() - ultimaOrden > timeout_freno) {
    limpiarOut();
  }
}