#include <Wire.h>
#include <VarSpeedServo.h> 
#include <Stepper.h>

#define SLAVE_ADDRESS 0x04                    //variabili per i2c
int number = 0;
int inviatoDaRaspberry = 0;                   //variabili per i2c
int state = 0;                                //variabili per movimento motori

const int stepsPerRevolution = 64;  // steps per revolution for stepper motorint stepCount = 0;  // number of steps the motor has taken

Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);
VarSpeedServo myservo;     

//int distanza = 1000;                          //numero degli step da fargli fare
int motorSpeed = 64;                            //rpm stepper
int posizioneAttuale = 0;                       //variabili per movimento motori
int posDaRaggiungere, distanzaDaPercorrere;     //variabili per movimento motori
int comunicazioneSeriale;
boolean loStepperHaFinito = false;
int byteArray[100];
//int byteArray[100];
int numByte;                                     //numero dei byte trasmessi dal Master
boolean hoRicevutoDati = false;
int firstPointer;               //variabile per usare i puntatori 

int pinServo = 6;

void setup() {
  Serial.begin(9600); // start serial for output
  Wire.begin(SLAVE_ADDRESS);  // initialize i2c as slave  
  
  serverToZero();
  
  // define callbacks for i2c communication
  Wire.onReceive(receiveDataList);
  Wire.onRequest(sendData);
}

void loop() {
  delay(1000);
  Serial.print("LOOP ");
  Serial.println(hoRicevutoDati);
  hoRicevutoDati = dalleNoteAlMotorino(hoRicevutoDati);
}

boolean dalleNoteAlMotorino (boolean hoRicevutoDati) {
  while (hoRicevutoDati == true) {

    //leggi i dati dall'array
    int lunghezzaArray = byteArray[0]; 
   
    for (int x=2; x<=lunghezzaArray; x++) {
      posDaRaggiungere = byteArray[x];
      Serial.print("posDaRaggiungere ");
      Serial.println(posDaRaggiungere);
      
      //calcola la distanza da percorrere in base alla posizione corrente
      //e muovi i motorini (le funzioni sono all'interno di calcoloDistanza
      posizioneAttuale = stepperCalcoloDistanza(posizioneAttuale, posDaRaggiungere);
      
    }
    
    //ritorna false per fermare il ciclo
    return hoRicevutoDati = false;
  }
}

void receiveDataList(int numByte){
    int i = 0;
    hoRicevutoDati = true;
    while(Wire.available() > 0){
      for(i=0; i < 100; i++){
        byteArray[i] = Wire.read();
        if (byteArray[i] == 255){
          //Serial.print("sono alla fine");
          break;
          }
        else{
          //i++;
        }
     };
  }
  hoRicevutoDati = true;
}



// callback for received data
void receiveData(int byteCount){
  while(Wire.available()) {
    //arduino legge in byte quindi io faccio il cast in int
    int posizioneDaRaggiungere = Wire.read();        //leggo il valore che manda la raspi
    Serial.print("il valore inviato da raspberry ");
    Serial.println(posizioneDaRaggiungere);
    posizioneAttuale = stepperCalcoloDistanza(posizioneAttuale, posizioneDaRaggiungere);
    //sendData();
  }
}


// callback for sending data
void sendData(){
  Wire.write("ok");
}


int stepperCalcoloDistanza(int attuale, int posizioneDaRaggiungere) {
    Serial.print("posizioneAttuale inizio seriale: ");
    Serial.println(attuale);
    int distanzaDaPercorrere = posizioneDaRaggiungere - attuale;
    Serial.print("distanzaDaPercorrere: ");
    Serial.println(distanzaDaPercorrere);
    moveStepper(distanzaDaPercorrere);      
    attuale = posizioneDaRaggiungere;   
    return attuale;
}

void serverToZero() {
  myservo.write(0, 0, true);       
}

void moveStepper(int distanzaDaPercorrere) {
  Serial.write("funzione stepper");
  //delay(5000);
  myStepper.setSpeed(motorSpeed);
  int stepDaPercorrere = distanzaDaPercorrere * 100; //calcolare i giri che servono a portare l'omino davanti alla nota
  myStepper.step(100); 
  myservo.attach(pinServo);
  moveServo(0, 99);      //0 velocità alta per il colpo, poi rientra in posizione zero con velocità più bassa 
  //moveServo(0, 1);  
  loStepperHaFinito = true;
}

void moveServo(int speedColpo, int speedRitorno) {
  myservo.attach(pinServo);                    // attaches the servo on pin 9 to the servo object 
  myservo.write(0, speedColpo, false);         // move to 180 degrees, use a speed of 30, wait until move is complete
  myservo.write(40, speedRitorno, true);       // move to 0 degrees, use a speed of 30, wait until move is complete
  loStepperHaFinito == false;
  myservo.detach();
}

/*
la libreria i2c passa i dati tenendo 32bit per carattere trasmesso che io poi riconverto in int
C normalmente tiene 2byte (16bit) per integer quindi quando gli dico di scorrere in un array di integer mi va a prendere elementi ogni 2 bit beccando un elemento vuoto, poi il valore, poi vuoto, poi il valore, poi vuoto...


*/


