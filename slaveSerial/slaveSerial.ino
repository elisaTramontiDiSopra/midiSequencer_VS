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
int motorSpeed = 64;                            //variabili per movimento motori
int posizioneAttuale = 0;                       //variabili per movimento motori
int posDaRaggiungere, distanzaDaPercorrere;     //variabili per movimento motori
int comunicazioneSeriale;
boolean loStepperHaFinito = false;
long byteArray[100];
//int byteArray[100];
int numByte;                                     //numero dei byte trasmessi dal Master
boolean hoRicevutoDati = false;
int firstPointer;               //variabile per usare i puntatori 

int pinServo = 6;

void setup() {
  Serial.begin(9600); // start serial for output
  Wire.begin(SLAVE_ADDRESS);  // initialize i2c as slave  
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
    int lunghezzaArray = (byteArray[0])*2; 
    for (int x=2; x<=lunghezzaArray; x=x+2) {
      posDaRaggiungere = byteArray[x];
      Serial.print("posDaRaggiungere ");
      Serial.println(posDaRaggiungere);
      
      //calcola la distanza da percorrere in base alla posizione corrente
      posizioneAttuale = stepperCalcoloDistanza(posizioneAttuale, posDaRaggiungere);

      //muovi il motorino quanto serve)
      
    }
    
    //ritorna false per fermare il ciclo
    return hoRicevutoDati = false;
  }


    
/*
    posDaRaggiungere = byteArray[1];
    Serial.print("posDaRaggiungere dentro il FOR   ");
    Serial.println(posDaRaggiungere);
    Serial.print("byte[1] ");
    Serial.println(byteArray[1]);
    Serial.print("byte[2] ");
    Serial.println(byteArray[2]);
    Serial.print("byte[3] ");
    Serial.println(byteArray[3]);*/
    /*int b = 1;
    while (b<=lunghezzaArray) {
      Serial.print("b "); 
      Serial.println(b); 
      posDaRaggiungere = byteArray[b];
      Serial.print("posDaRaggiungere "); 
      Serial.println(posDaRaggiungere);
      b = b+2;
    }*/

    /* POINTER EXPERIMENT
    int ultimoPointer = firstPointer + (lunghezzaArray*4);

    int intero = byteArray[0];
    int* pointer = &intero;
    int** q = &pointer;
    for (int a = firstPointer; a <= ultimoPointer; a = a+4) {
      //*q= a;
      Serial.print("a ");
      Serial.println(a);
      //Serial.print("pointer ");
      //Serial.println(pointer);
      Serial.print("**q ");
      Serial.print(**q);
    }*/
    
    /*
    int *p;
    int pointer = (int)&byteArray[0];
    Serial.print("pointer ");
    Serial.println(pointer);
    int lunghezzaArray = byteArray[0];
    int ultimoPointer = pointer + (lunghezzaArray*4);
    *p = pointer; //metto dentro il pointer p il valore dell'indirizzo dell'array che ho trovato prima e messo dentro pointer
    Serial.print("*p ");
    Serial.println(*p);
    Serial.print("&p ");
    //Serial.println(&p);

      return hoRicevutoDati = false;
    }

    Serial.print("MOTORINO ");
    Serial.println(hoRicevutoDati);
    Serial.print("pointer[0] ");
    Serial.println((int)&byteArray[0]);
    Serial.print("byte[0] ");
    Serial.println(byteArray[0]);
    Serial.print("pointer[1] ");
    Serial.println((int)&byteArray[1]);
    Serial.print("byte[1] ");
    Serial.println(byteArray[1]);
    Serial.print("byte[2] ");
    Serial.println((int)&byteArray[2]);
    Serial.print("byte[3] ");
    Serial.println((ints)byteArray[3]);
    Serial.print("byte[199] ");
    Serial.println((int)&byteArray[199]);*/
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
          /*
          Serial.print("numero ricevuto ");
          Serial.println(byteArray[i]);
          Serial.print("pointer indirizzo ");
          Serial.println((int)&byteArray[i]);   //devo mettere (int) perchè se c'è uno 0 il compilatore di Arduino rischia di non sapere come intepretarlo quindi gli devo ricorcare che è un int
          */
          i++;
        }
     };
  }
  hoRicevutoDati = true;
  //firstPointer = (int)&byteArray[0];
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
  delay(5000);
  myStepper.setSpeed(motorSpeed);
  int stepDaPercorrere = distanzaDaPercorrere * 10; //calcolare i giri che servono a portare l'omino davanti alla nota
  //myStepper.step(stepDaPercorrere); 
  myStepper.step(100); 
  //loStepperHaFinito = true;
}

void moveServo(int speedColpo, int speedRitorno) {
  myservo.attach(pinServo);  // attaches the servo on pin 9 to the servo object 
  myservo.write(30, speedColpo, false);        // move to 180 degrees, use a speed of 30, wait until move is complete
  myservo.write(0, speedRitorno, true);        // move to 0 degrees, use a speed of 30, wait until move is complete
  Serial.println("I moved!!!");
  //sonoAlPosto == false;
  myservo.detach();
}

/*
la libreria i2c passa i dati tenendo 32bit per carattere trasmesso che io poi riconverto in int
C normalmente tiene 2byte (16bit) per integer quindi quando gli dico di scorrere in un array di integer mi va a prendere elementi ogni 2 bit beccando un elemento vuoto, poi il valore, poi vuoto, poi il valore, poi vuoto...


*/


