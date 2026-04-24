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

int prenderMotor (int pin){
    if (pin == 3 || pin == 4) {
        analogWrite(ENA , velocidad);
        digitalWrite(pin, HIGH);
        Serial.print("Activando el pin ");
        Serial.println(pin);
    } 

    if (pin == 5 || pin == 6) {
        analogWrite(ENB, velocidad);
        digitalWrite(pin, HIGH);
        Serial.print("Activando el pin ");
        Serial.println(pin);
    }

}

int apagarMotor (int pin){
    if (pin == 3 || pin == 4) {
        analogWrite(ENA, 0);

    }
    

    if(pin == 5 || pin == 6) {
        analogWrite(ENB, 0);
    }
}

int lector(int Puerto, const char* dedo) {
    int lectura = 0;
    int lectruaS = 0;
    for (int i = 0; i < 5; i++) {
        lecturaS += analogRead(Puerto);
        delayMicroseconds(100);
    }
    lectura = lecturaS/5;


    int out = map(lectura, 0, 1023, 0, 100);
    Serial.print(dedo);
    Serial.print(":");
    Serial.println(out);
}

void setup() {
 Serial.begin(9600);
 pinMode(3, OUTPUT); 
 pinMode(4,OUTPUT); 
 pinMode(9,OUTPUT);
 pinMode(5,OUTPUT); 
 pinMode(6,OUTPUT); 
 pinMode(9,OUTPUT);
 pinMode(10,OUTPUT);
}

void loop() {
    //Detección de dedos
    lector(dedo0, "indice");
    lector(dedo1, "mayor");
    lector(dedo2, "anular");
    lector(dedo3, "meñique");

    //Movimiento del auto
    string orden = Serial.readString();

    if(orden == "Adelante"){
        prenderMotor(3);
        prenderMotor(5);
    }
    if(orden == "Atras"){
        prenderMotor(4);
        prenderMotor(6);
    }
    if(orden == "Izquierda"){
        apagarMotor(3);
        prenderMotor(5);
    }
    if(orden == "Derecha"){
        prenderMotor(3);
        apagarMotor(5);
    }
    delay(200);
}