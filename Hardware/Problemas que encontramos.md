Problema 0: estamos completamente en blanco

    Al iniciar el proyecto teníamos multitud de problemas a resolver en distintas partes del proyecto (auto y guante). Tantas tareas nuevas que no habíamos hecho antes eran un poco abrumadoras, asi que decidimos ir dividiendolas poco a poco

Problema 1: conectar un puente H l298N

    Los profesores nos dijeron que la unica manera de controlar por software la dirección en la que gira un motor era UN PUENTE H. Este es un circuito que controlando el estado de 4 compuertas (que dejan o no pasar la corriente por un cable) eran capaces de hacer que la corriente circule por un motor en una dirección o en otra. Pero para hacer esto en la realidad era necesario conectar este puente h al arduino y a una fuente externa  para poder tener la corriente necesaria. Aprender a conectar todo esto no fue facíl, porque es bastante contraintuitivo. Al final, encontramos un tutorial animado en youtube que explicaba muy paso a paso como conectarlo, y creamos la guia en este github "Como_conectar_un_puente_h_con_motores_y_arduino".

Problema 2: Probar el puente h con un codigo simple

    Estabamos cortos de tiempo, asi que decidimos usar una herramienta de inteligencia artificial para que nos ayude a probar si habíamos conectado bien todo (puente h, arduino, motores, fuente), pero rapidamente nos dimos cuenta que las IAs no son muy buenas para explicar los codigos que generan, menos para explicarte como conectar  componentes. Pero esto quedó guardado en "PrototipoCodigoGPT" (Este archivo luego fue modificado) y en "Vitacora_de_programas". 

Problema 3: El puente h estaba quemado... estupendo

    Estuvimos cerca de dos clases tratando de averiguar por qué  nuestro codigo simple, que lo unico que hacía era prender un motor y luego apagarlo, no funcionaba. Y al final un profesor revisó nuestro circuito y nos dió esta fatidica noticia que nos reveló que habíamos estado perdiendo el tiempo, ahora podíamos pasar a la siguuiente fase al menos, ver si podíamos controlar estos dos motores según el imput de un usuario, que estaría representado por 4 botones.

Problema 4: Un botón nunca funcionó 

    Para hacer este programa, volvimos a usar IA, que tambien volvió a dar problemas con el depurador y terminamos cambiandolo, pero eso si está en "PrototipoCodigoGPT". Al final al hacer nuestro propio codigo todo funcionó muy bien, podías hacer que los dos motores se muevan en ambas direcciones a una velocidad estandar, excepto por el botón 4 que hacía girar al motor 2 en sentido horario, ese botón nunca funcionó y nunca supimos el por qué, pero al ser simplemente una practica decidimos no perder mas tiempo en eso y pasar a la siguiente fase, donde reemplazariamos a los botones por sensores y a esos motores pequeños por motoreductores. 

Problema 5: El codigo no imprimia los valores de flexión por un problema de conexión

    Ya teniamos "experiencia" codificando este tipo de programas, por lo que no tomó mucho tiempo. El problema es que no podíamos probarlo el na vida real, porque si bien habíamos pedido los sensores aun no habían llegado (a fecha de cuando estoy escribiendo esto siguen sin llegar), por lo que si o si tuvimos que probarlo en tinkercad. Para nuestra sorpresa nada funcionaba, el codigo no imprimía ningun valor al doblar un sensor.
     Volvimos a usar la inteligencia artificial, pero solo para ver si había algun error en nuestro codigo o en la manera en la que estabamos conectando los sensores, y al menos esta vez si fué de ayuda. Resulta que un flex sensor funciona variando su valor resistivo en base a su nivel de flexión, modificando la caida de voltaje entre sus dos extremos, pero para medir eso teníamos que crear un DIVISOR DE VOLYAJE. ¿qué es esto? está explicado en "Como_Conectar_FlexSensors".

Problema 6: Tinkercad simula mal nuestro circuito (por mas raro que suene)

    Luego de crear ese divisor de voltaje volvimos a probar si funcionaba, y esta vez tampoco funcionó. Ahí fue cuando nos enteramos por la IA que al parecer tinkercad tiene problemas para simular estos sensores y no funcionan bien casi nunca. Nos paresió rarísima la respuesta, pero lo confirmó un profesor al que le preguntamos, asi que ahora tenemos que esperar a que lleguen los flex sensors y probarlo en persona... Que tensión.