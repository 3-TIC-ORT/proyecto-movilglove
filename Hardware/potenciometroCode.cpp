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

int lecturaS = 0;

//Este contador se usa para frenar el auto si no llega ninguna orden de la computadora durante 200ms
unsigned long ultimaOrden = 0;
const unsigned long timeout_freno = 100;

// Siempre llamar limpiarOut() antes de prenderMotor()
// para garantizar que el pin complementario esté en LOW
void prenderMotor (int pin)
{
 if (pin == in1 || pin == in2) 
 {
  analogWrite(ENA , velocidad);
  digitalWrite(pin, HIGH);
  Serial.print("Activando el pin ");
  Serial.println(pin);
 } 

 if (pin == 5 || pin == 6) 
 {
  analogWrite(ENB, velocidad);
  digitalWrite(pin, HIGH);
  Serial.print("Activando el pin ");
  Serial.println(pin);
 }

}

void apagarMotor (int pin)
{
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
  Serial.print(dedo);
  Serial.print(":");
  Serial.println(map(analogRead(Puerto), 4, 500, 0, 100));//Una vez montado en el guante, el máximo que registra un potenciometro es alrededor de 500, no llega a los 230 grados completo 
}
void limpiarOut() 
{
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
    prenderMotor(in1);
    prenderMotor(in4);
   }

   if(orden == "Izquierda"){
   Serial.println("Orden izquierda recibida");
    limpiarOut();
    apagarMotor(in1);
    prenderMotor(in3);
   }

   if(orden == "Derecha"){
    Serial.println("Orden derecha recibida");
    limpiarOut();
    prenderMotor(in1);
    apagarMotor(in3);
   }
   ultimaOrden = millis();
 }
 if (millis() - ultimaOrden > timeout_freno) {
    limpiarOut();
  }
}