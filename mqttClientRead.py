import paho.mqtt.client as mqtt

hostBroker = "broker.hivemq.com"
porta = 8000
topic = "midiSequencerDiomede"

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
    #print("Topic",msg.topic+'Messaggio: '+str(msg.payload))

#initialize MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("broker.hivemq.com", 1883, 60)
client.loop_forever()