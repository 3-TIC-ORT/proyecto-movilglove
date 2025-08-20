A continuación hay una serie de instrucciones y codigo para mover un motor en sentido horario o antihorario dependiendo de que botón se esté pulsando. Es un prototipo simple para ver si sabemos usar los motores y los puentes H, luego haremos la programación real:

    Botón 1 → Motor gira en sentido horario (avanzar).

    Botón 2 → Motor gira en sentido antihorario (retroceder).

    Ningún botón → Motor detenido.

    Conexión de los botones:

Cada botón tiene dos patitas. Conecta una patita a GND. La otra patita a un pin digital del Arduino (ejemplo: 2 y 3).
 Vamos a usar el modo INPUT_PULLUP, lo que significa que los botones estarán normalmente en HIGH y al presionarlos pasarán a LOW.

 Codigo:

 // Pines de control del puente H
int IN1 = 8;    // Control del sentido del motor
int IN2 = 9;
int ENA = 10;   // Pin PWM para la velocidad del motor

// Pines de botones
int botonAvanzar = 2;   // Botón para girar horario
int botonRetroceder = 3; // Botón para girar antihorario

void setup() {
  // Configuramos pines del puente H como salida
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENA, OUTPUT);

  // Configuramos botones como entrada con resistencia pull-up interna
  pinMode(botonAvanzar, INPUT_PULLUP);
  pinMode(botonRetroceder, INPUT_PULLUP);

  // Al inicio, el motor debe estar detenido
  detenerMotor();
}

void loop() {
  // Leemos el estado de los botones
  bool estadoAvanzar = digitalRead(botonAvanzar);     // LOW = presionado
  bool estadoRetroceder = digitalRead(botonRetroceder);

  // Si se presiona el botón de avanzar
  if (estadoAvanzar == LOW && estadoRetroceder == HIGH) {
    avanzar();
  }
  // Si se presiona el botón de retroceder
  else if (estadoRetroceder == LOW && estadoAvanzar == HIGH) {
    retroceder();
  }
  // Si no se presiona ninguno, o ambos a la vez → detener por seguridad
  else {
    detenerMotor();
  }
}

// --- Funciones auxiliares --- //

void avanzar() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200); // Velocidad (0 a 255)
}

void retroceder() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, 200); // Velocidad
}

void detenerMotor() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 0);   // Apaga el motor
}