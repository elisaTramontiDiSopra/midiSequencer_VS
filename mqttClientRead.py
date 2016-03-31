import paho.mqtt.client as mqtt
import json
import requests
import serial
from firebase import firebase
from firebase_token_generator import create_token

hostBroker = "broker.hivemq.com"
porta = 8000
topic = "midiSequencerDiomede"

firebaseSecret = '04XfckMZt6tiJcgEC1exmlXToPEsxLws0kAX5cye'
urlDB = 'https://midisequencer.firebaseio.com'
firebase = firebase.FirebaseApplication(urlDB, None)

def calcolaQuandoLaCanzoneFinisce(sequenza_note):
    contatorePause=0
    while (contatorePause<=5):
        for n in sequenza_note:
            if (sequenza_note[n]==0):
                contatorePause++
            else
                contatorePause=0

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    print("Subscribed topic:" + topic)
    client.subscribe(topic)

#funzione chiamata quando arriva un messaggio
def on_message(client, userdata, msg):
    idCanzone = '/'+str(msg.payload.decode()[10:]) #mqtt lavora in byte 'b' quindi si fa il decode in utf-8
    print(idCanzone)
    jsonDiRispostaDaFirebase = firebase.get(idCanzone, None)
    sequenza_note = jsonDiRispostaDaFirebase['sequenza_note']
    print(sequenza_note)

    #print("Topic",msg.topic+'Messaggio: '+str(msg.payload))



#initialize MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect_async("broker.hivemq.com", 1883, 60) #solo connect è bloccante, connect_asynch no
client.loop_forever()