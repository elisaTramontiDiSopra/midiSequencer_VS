import json
import requests
import serial
from firebase import firebase
from firebase_token_generator import create_token
import mqttClientRead

#print(idCanzone)

#contatorePause = 0
firebaseSecret = '04XfckMZt6tiJcgEC1exmlXToPEsxLws0kAX5cye'
idCanzone = '/'+'1457618305106'
urlDB = 'https://midisequencer.firebaseio.com'
nomePorta = 'COM3'                 #cambia tra linux e windows
#portaSeriale =  serial.Serial(nomePorta, 9600)  # open serial port
#print(portaSeriale.name)         # check which port was really used
#portaSeriale.write(b'hello')     # write a string
#portaSeriale.close()             # close port

'''
auth_payload = { "uid": "uniqueId1", "auth_data": "foo", "other_auth_data": "bar" }
token = create_token(firebaseSecret, auth_payload)
'''
def miConnettoAFirebase(idCanzone):
    firebase = firebase.FirebaseApplication(urlDB, None)
    jsonDiRispostaDaFirebase = firebase.get(idCanzone, None)
    sequenza_note = jsonDiRispostaDaFirebase['sequenza_note']
    print(sequenza_note)