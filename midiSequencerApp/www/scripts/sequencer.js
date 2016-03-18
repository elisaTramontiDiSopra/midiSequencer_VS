﻿/************************************** VARIABILI VARIE ************************************/
//numCol = 100;	
//var myFirebaseRef = new Firebase("https://midisequencer.firebaseio.com/");		//imposto il riferimento al database
arrayCanzone = new Array(numCol);
for (a = 0; a < numCol; a++) { arrayCanzone[a] = 0; };									//creo un array vuoto per la canzone e assegno valore 0 a tutte le posizioni

//toggle function for buttons
function toogle(targetElement) {
    //trovo la colonna, l'indice della colonna e lo metto in T come numero intero
    colonna = targetElement.parentNode;
    colonnaId = colonna.getAttribute("id");
    t = colonnaId.slice(-2);
    t = parseInt(t);
    /****************  PERCHE' NON POSSO USARE THIS? ***************************************/
    //trovo l'id del pulsante e lo metto in I
    i = targetElement.getAttribute("data-value");
    i = parseInt(i);
    controlloSeLaClasseEUnchecked(targetElement);
    //creo l'array delle note nella colonna
    noteColonna = colonna.children;
    //se la classe è unchecked
    if (classePulsante == "unchecked") {
        //vedo se c'è già qualche elemento checked e lo metto unchecked
        prevChecked = document.getElementById(colonnaId).getElementsByClassName("checked")[0];
        if (prevChecked != null) {
            //se c'è un elemento che prima era checked inverto le classi css
            prevChecked.classList.remove("checked");
            prevChecked.classList.add("unchecked");
        }
        targetElement.classList.remove("unchecked");
        targetElement.classList.add("checked");
        //do alla nota il valore del pulsante e lo metto nell'array nella posizione T
        valoreNota = i;
        arrayCanzone[t] = valoreNota;
        //console.log(arrayCanzone);			
        //se la classe è checked la metto unchecked e ripristino la classe nota che mi serve per il css
    } else {
        targetElement.className = "unchecked nota" + i;
        //do alla nota il valore 0=pausa e lo metto nell'array nella posizione T
        valoreNota = 0;
        arrayCanzone[t] = valoreNota;
        //controlloSeLaPosizioneArrayEOccupata();
    }
}

//controllo se nella classe del pulsante c'è unckecjked
function controlloSeLaClasseEUnchecked(targetElement) {
    //seleziono le prime 9 lettere della classe per vedere se è unchecked
    classePulsanteUno = targetElement.className.slice(0, 9);
    //seleziono le ultime 9 lettere della classe per vedere se è unchecked
    classePulsanteDue = targetElement.className.slice(-9);
    //se all'inizio o alla fine della classe c'è unchecked allora l'elemento è unchecked, altrimenti è checked
    if (classePulsanteUno == "unchecked" || classePulsanteDue == "unchecked") {
        classePulsante = "unchecked";
    } else {
        classePulsante = "checked";
    }
}



function salva() {
    nomeCanzone = document.getElementById("nomeCanzone").value;		//prendo il nome della canzone 
    var idCanzone = prelevailTempoComeIndice();				    	//creo questa variabile da usare per contenere il timestamp che sarà un id unico tipo indice
    var canzoneRef = myFirebaseRef.child(idCanzone);				//creo un elemento child nel db per la mia canzone
    var canzoneRefPush = canzoneRef.push();							//creo questa variabile per poter usare push che così mi creerà nomi dinamici numerici e automatici - index
    canzoneRef.set({
        "nome_canzone": nomeCanzone,
        "sequenza_note": arrayCanzone,
        "id": idCanzone,
    });
    twittaSalvataggioCanzone(nomeCanzone);
    console.log("salvato")
}

//preleva timecode	
function prelevailTempoComeIndice() {
    var d = new Date();
    var id = d.getTime();
    return id;
}



/* FUNZIONI IFTT *****************/
function twittaSalvataggioCanzone(nomeCanzone) {
    url = "https://maker.ifttt.com/trigger/" + evento + "/with/key/" + personalKey + "?value1=" + nomeCanzone;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
    console.log("twittato")
}

/*************************** FUNZIONI DEL SEQUENCER DI UNA CANZONE GIA' CREATA */
//cerco le variabili che ho passato nell'URL		
function cercoVariabileGetInURL() {
    return window.location.search.substring(4); //tolgo i primi 4 caratteri che sono ?id=
}


//load 
function pageLoad() {
    idURL = cercoVariabileGetInURL;
    if (idURL !== undefined) {
        //LA CANZONE E'CAROCATA
        //funzione spinner
        var canzoneSelezionata;
        console.log('Inizio load degli oggetti');
        recuperoValoriCanzoneSelezionata(function (snap) {
            //console.log(snap);
            console.log('Fine load degli oggetti');
            //canzoneSelezionata = snap.val();			
            //funzioneSpinner();
            coloroTastiniCanzoneSelezionata(snap.val());
            console.log()
        });


    } else {
        //LA CANZONE E' NUOVA
        //disabilita pulsante play
        disattivaPulsante(pusalntePlayCanzone);
    }


    /*
    //funzioneSpinner();
    var canzoneSelezionata;
    console.log('Inizio load degli oggetti');
    recuperoValoriCanzoneSelezionata(function (snap) {
        //console.log(snap);
        console.log('Fine load degli oggetti');
        //canzoneSelezionata = snap.val();			
        //funzioneSpinner();
        coloroTastiniCanzoneSelezionata(snap.val());
        
    });*/

};

function inseriscoNomeCanzoneNelInput(nomeCanzoneSelezionata) {
    var campoInput = document.getElementById("nomeCanzone");
    campoInput.innerHTML = nomeCanzoneSelezionata;            
}


//coloro i tastini e metto il nome della canzone al suo posto
function coloroTastiniCanzoneSelezionata(canzoneSelezionata) {
    var nomeCanzoneSelezionata = canzoneSelezionata.nome_canzone;
    inseriscoNomeCanzoneNelInput(nomeCanzone);
    var sequenzaCanzoneSelezionata = canzoneSelezionata.sequenza_note;
    for (z = 0; z < 50; z++) {
        valoreNota = sequenzaCanzoneSelezionata[z];
        if (valoreNota !== 0) {
            colonnaId = determinoIdColonna(z);
            classeCSSNota = "nota" + valoreNota;
            //console.log(classeCSSNota);
            notaDaCheckare = document.getElementById(colonnaId).getElementsByClassName(classeCSSNota)[0];
            //console.log(notaDaCheckare);
            notaDaCheckare.classList.remove("unchecked");
            notaDaCheckare.classList.add("checked");
        }
    }
}

function determinoIdColonna(numeroColonna) {
    if (numeroColonna < 10) {
        colonnaId = "col0" + numeroColonna;
    } else {
        colonnaId = "col" + numeroColonna;
    }
    return colonnaId;
}

//recupero i valori della canzone selezionata ---> idURL, sequenza_note, nome_canzone;
function recuperoValoriCanzoneSelezionata(recuperaValoreSnapDellaCanzoneSelezionata) {
    idURL = cercoVariabileGetInURL();
    urlPerFirebase = myFirebaseRef + "/" + idURL;
    var sequenza_note = [];
    var myFirebaseReference = new Firebase(urlPerFirebase)
    myFirebaseReference.once("value", recuperaValoreSnapDellaCanzoneSelezionata);
}

//recupero i valori di sequenza_note
function recuperoValoriSequenzaNote() {
    //per mantenere la variabile idURL locale la piazzo qui dentro la funzione
    idURL = cercoVariabileGetInURL();
    console.log("idurl " + idURL);
    myFirebaseRef.once('value', function (dataSnapshot) {
        //con .val prendo tutti i dati del mio database che si trovano dentro a datasnapshot e le ottengo come oggetto JS
        var tutteLeCanzoni = dataSnapshot.val();
        dataSnapshot.forEach(function (childSnapshot) {
            //vado a prendermi i valori della canzone singola
            var canzoneSingola = childSnapshot.val();
            var nomeCanzoneSingola = canzoneSingola.nome_canzone;
            var idCanzoneSingola = canzoneSingola.id;
        });
    });
}

//coloro i tasti
function coloroLeNoteDiUnaCanzoneSalvata() {
    //prendo l'array e lo disintegro
    for (b = 0; b < numCol; b++) {
        valoreNota = array[b];
        //determino il nome della colonna - formato col00
        if (b > 10) {
            idColonnaCanzoneSalvata = "col0" + b;
        }
        else {
            idColonnaCanzoneSalvata = "col" + b;
        }
        //seleziono la colonna
        colonnaCanzoneSalvata = getElementByID(idColonnaCanzoneSalvata);
    }
}


/*MQTT*/

var client; topic; messaggioPerRaspi;

function playCanzone() {
    console.log("play premuto");
    var mqttHost = 'broker.hivemq.com';
    topic = 'midiSequencerDiomede';
    messaggioPerRaspi = "idCanzone"+
    client = new Paho.MQTT.Client(mqttHost, 8000, "myclientid_" + parseInt(Math.random() * 100, 10));
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({ onSuccess: onConnect });
}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(topic);
    var message = new Paho.MQTT.Message(messaggioPerRaspi);
    message.destinationName = topic;
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


if (cercoVariabileGetInURL !== null) {
    //se c'è un idURL la canzone è già salvata quindi
    console.log("la canzone è già salvata");
    //attiva il tasto play
    //attiva le funzioni mqtt
} else {
    console.log('la canzone non è salvata')
    //disattiva il tasto play
    //disattiva mqtt
    //attiva le funzioni normali del sequencer
}


/* FUNZIONI PER QUANDO LA CANZONE E' RECUPERATA **** */

//funziona per il pulsante visto che elimina la classe round-button
//verificare se ci sia la necessità di renderla una funzione più generica
function disattivaPulsante(idElementoDaDisattivare) {
    elementoDaDisattivare = document.getElementById(idElementoDaDisattivare);
    //aggiungi classe pulsanteDisabilitato
    elementoDaDisattivare.classList.add("pulsanteDisabilitato");
    elementoDaDisattivare.classList.remove("round-button");
    
    //elimina il richiamo alla funzione JS
    
}



pageLoad()