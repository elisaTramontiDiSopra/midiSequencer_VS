import json
import requests
import serial
from firebase import firebase
from firebase_token_generator import create_token

contatorePause = 0
firebaseSecret = '04XfckMZt6tiJcgEC1exmlXToPEsxLws0kAX5cye'
idCanzone = '/'+'1457618305106'
urlDB = 'https://midisequencer.firebaseio.com'
nomePorta = 'COM1'                 #cambia tra linux e windows
portaSeriale =  serial.Serial(nomePorta, 9600)  # open serial port
#print(portaSeriale.name)         # check which port was really used
#portaSeriale.write(b'hello')     # write a string
#portaSeriale.close()             # close port


auth_payload = { "uid": "uniqueId1", "auth_data": "foo", "other_auth_data": "bar" }
token = create_token(firebaseSecret, auth_payload)


firebase = firebase.FirebaseApplication(urlDB, None)
jsonDiRispostaDaFirebase = firebase.get(idCanzone, None)
print(jsonDiRispostaDaFirebase)
sequenza_note = jsonDiRispostaDaFirebase['sequenza_note']
print(sequenza_note)

'''
for x in sequenza_note:
    while (contatorePause <5):
        if sequenza_note[x] == 0:
            contatorePause =+1
        else :
            contatorePause = 0;
    sequenza_note[x] = 'S'
    break

for y in sequenza_note :
    if sequenza_note[y] != 'S':
       portaSeriale.write(sequenza_note[y])

'''