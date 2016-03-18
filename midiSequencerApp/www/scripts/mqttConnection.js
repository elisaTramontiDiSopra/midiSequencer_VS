topicDaSottoscrivere = "testTopicEliRoot";
messaggioDaInviare = "messaggio inviato via MQTT"

// Create a client instance
var client = new Paho.MQTT.Client("test.mosquitto.org", 8080, "myclientid_" + parseInt(Math.random() * 100, 10))
//QUESTA E? QUELLA COPIATA CHE DOVFEBBE FUNZIONARE  ****************************** client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");
//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });


// called when the client connects
function onConnect(topicDaSottoscrivere, messaggioDaInviare) {



    console.log("onconnect avviato")
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(topicDaSottoscrivere);
    message = new Paho.MQTT.Message(messaggioDaInviare);
    console.log(messaggioDaInviare)
    message.destinationName = "/World";
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
}