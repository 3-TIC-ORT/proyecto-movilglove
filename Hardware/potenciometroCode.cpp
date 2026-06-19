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

int prenderMotor (int pin)
{
 if (pin == 3 || pin == 4) 
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

int apagarMotor (int pin)
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

int lector(int Puerto, const char* dedo)
{
  Serial.print(dedo);
  Serial.print(":");
  Serial.println(map(analogRead(Puerto), 5, 500, 0, 100));//Una vez montado en el guante, el máximo que registra un potenciometro es alrededor de 500, no llega a los 230 grados completo 
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
    limpiarOut();
    String orden = Serial.readStringUntil('\n');

 if(orden == "Adelante"){
    limpiarOut();
    prenderMotor(3);
    prenderMotor(5);
    }

 if(orden == "Atras"){
    limpiarOut();
    prenderMotor(4);
    prenderMotor(6);
    }

 if(orden == "Izquierda"){
    limpiarOut();
    apagarMotor(3);
    prenderMotor(5);
    }

 if(orden == "Derecha"){
    limpiarOut();
    prenderMotor(3);
    apagarMotor(5);
    }
}
