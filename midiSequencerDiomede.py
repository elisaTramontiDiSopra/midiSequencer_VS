import paho.mqtt.client as mqtt
import json
import requests
import serial
import smbus
import time
from firebase import firebase
from firebase_token_generator import create_token

#variabili per MQTT
hostBroker = "broker.hivemq.com"
porta = 1883
topic = "midiSequencerDiomede"

#variabili per recuperare i dati da firebase
firebaseSecret = '04XfckMZt6tiJcgEC1exmlXToPEsxLws0kAX5cye'
urlDB = 'https://midisequencer.firebaseio.com'
firebase = firebase.FirebaseApplication(urlDB, None)

#variabili per troncare la sequenza note
sequenzaDaInviare = []
numeroDiPauseCheSegnanoLaFineDellaCanzone = 5

#variabili per I2C
address = 0x04  #address per slave arduino
bus = smbus.SMBus(1)
invioUnico = 1
lunghezzaListaNote = 0



def inviaSequenzaNoteAdArduino():
    lunghezzaListaNote = len(sequenzaDaInviare)
    bus.write_block_data(address, lunghezzaListaNote, sequenzaDaInviare)
    time.sleep(0.2)

def writeData(sequenzaDaInviare):
    for i in sequenzaDaInviare:
        bus.write_byte(address, i)


def calcolaQuandoLaCanzoneFinisce(sequenza_note):
    contatorePause = 0
    for n in sequenza_note:
        if contatorePause == numeroDiPauseCheSegnanoLaFineDellaCanzone:
            sequenzaDaInviare.append(255)
            break
        elif n == 0:
            sequenzaDaInviare.append(n)
            contatorePause += 1
        else :
            sequenzaDaInviare.append(n)
            contatorePause = 0
    return sequenzaDaInviare

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    print("Subscribed topic:" + topic)
    client.subscribe(topic)

#funzione chiamata quando arriva un messaggio
def on_message(client, userdata, msg):
    del sequenzaDaInviare[:]
    idCanzone = '/'+str(msg.payload.decode()) #mqtt lavora in byte 'b' quindi si fa il decode in utf-8
    print(idCanzone)
    jsonDiRispostaDaFirebase = firebase.get(idCanzone, None)
    sequenza_note = jsonDiRispostaDaFirebase['sequenza_note']
    print(sequenza_note)
    calcolaQuandoLaCanzoneFinisce(sequenza_note)
    print('sequenza da inviare ', sequenzaDaInviare)
    lunghezzaListaNote = len(sequenzaDaInviare)
    #print ('lunghezza sequenza da inviare ', lunghezzaListaNote)
    inviaSequenzaNoteAdArduino()
    time.sleep(0.1)
    #invioUnico = 2


#initialize MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect_async(hostBroker, porta, 60) #solo connect è bloccante, connect_asynch no
client.loop_forever()
