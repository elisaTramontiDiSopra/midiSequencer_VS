import smbus
import time
import readAndParseFirebase

bus=smbus.SMBus(1)
invioUnico = 1
listaNote = [0,2,5,4,9,6,7,8,9,0,8,7,5,3,4,5,12,1,2,1,11,2,5,6,0,9,0,0,0,0,0,255]
sequenza_note = jsonDiRispostaDaFirebase['sequenza_note']
lunghezzaListaNote = (listaNote)

#address per slave arduino
address = 0x04

def invioSuperioreATrentadueByte():
    x = 32
    if (lunghezzaListaNote > 32):
        #slice list
        listaNote[1 : x]
        x = x + 32
    else:
        inviaSequenzaNoteAdArduino()



def inviaSequenzaNoteAdArduino():
    bus.write_block_data(address, sequenza_note, listaNote)
    #bus.write_block_data(address, lunghezzaListaNote, listaNote)
    time.sleep(0.2)

while invioUnico ==1:
    print(listaNote)
    print ("lunghezza lista ", lunghezzaListaNote)
    inviaSequenzaNoteAdArduino()
    time.sleep(1)
    invioUnico = 2