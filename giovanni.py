#!/usr/bin/python3
#autore: Giovanni Buffa

import time, json, threading
import paho.mqtt.client as mqtt
#import RPi.GPIO as GPIO

inits = {
  "thread": 100,
  "log": {
    "file": "giovannibuffa.log",
    "format": {
      "giovannibuffa": {
        "timestamp": "",
        "temp": 0.0
      }
    }
  },
  "MQTT": {
    "brocker": "broker.hivemq.com",
    "topic": "midiSequencerDiomede",
  },
  "LEDS": {
    "Red": 12,
    "Orange": 16,
    "Green": 18
  }
}

def on_connect(client, userdata, flags, rc):
  print("Subscribe on topic {}".format(inits["MQTT"]['topic']))
  client.subscribe(inits["MQTT"]['topic'])
'''
def setLEDS():
  GPIO.setwarnings(False)
  GPIO.setmode(GPIO.BOARD)
  for led in inits["LEDS"]:
    GPIO.setup(inits["LEDS"][led], GPIO.OUT)

def onOffLED(color, state):
  GPIO.output(inits["LEDS"][color], int(state))
'''
def updateRead():
  '''
  sensors = giovannibuffa_temp.setSensors()
  temps = giovannibuffa_temp.getTemperature(sensors)

  #modify global temp
  inits["log"]["format"]["giovannibuffa"]["temp"] = temps;
  #modify global time
  inits["log"]["format"]["giovannibuffa"]["timestamp"] = time.strftime("%Y%m%dT%H%M%S%z");
'''
  try:
    client.publish(inits["MQTT"]['topic'], temps)
    print("Publish on topic {}".format(inits["MQTT"]['topic']))
  except:
    print("Impossible to publish!")

  #save log
  j = json.dumps(inits["log"]["format"])
  log = open(inits["log"]["file"], "w")
  log.write(j)
  log.close()
'''
  for key, value in temps.items():
    if value > 25.00:
      onOffLED("Orange", 0)
      onOffLED("Green", 0)
      onOffLED("Red", 1)

    if value < 19.99:
      onOffLED("Orange", 0)
      onOffLED("Green", 1)
      onOffLED("Red", 0)

    if value > 20.00 and value < 24.99:
      onOffLED("Orange", 1)
      onOffLED("Green", 0)
      onOffLED("Red", 0)

def init():
  threading.Timer(int(inits["thread"]), init).start()
  updateRead()
'''
try:
  # setting LEDS output
  #setLEDS()
  #initialize MQTT
  client = mqtt.Client()
  client.on_connect = on_connect
  client.connect(inits["MQTT"]["brocker"], 1883, inits['thread'])
  client.loop_start()
except:
  print("Impossible to get anything!")

# init script
init()
