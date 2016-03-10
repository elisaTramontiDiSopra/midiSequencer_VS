/************************************** VARIABILI VARIE ************************************/
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
    var canzoneRef = myFirebaseRef.child(idCanzone);				//creo un elemento child nel db per la mia canzone
    var canzoneRefPush = canzoneRef.push();							//creo questa variabile per poter usare push che così mi creerà nomi dinamici numerici e automatici - index
    var idCanzone = prelevailTempoComeIndice();				    	//creo questa variabile da usare per contenere il timestamp che sarà un id unico tipo indice
    canzoneRef.set({
        "nome_canzone": nomeCanzone,
        "sequenza_note": arrayCanzone,
        "id": idCanzone,
    });
}

//preleva timecode	
function prelevailTempoComeIndice() {
    var d = new Date();
    var id = d.getTime();
    return id;
}


/*************************** FUNZIONI DEL SEQUENCER DI UNA CANZONE GIA' CREATA */
//cerco le variabili che ho passato nell'URL		
function cercoVariabileGetInURL() {
    return window.location.search.substring(4); //tolgo i primi 4 caratteri che sono ?id=
}

//load 
function pageLoad() {
    //funzioneSpinner();
    var canzoneSelezionata;
    console.log('Inizio load degli oggetti');
    recuperoValoriCanzoneSelezionata(function (snap) {
        //console.log(snap);
        console.log('Fine load degli oggetti');
        //canzoneSelezionata = snap.val();			
        //funzioneSpinner();
        coloroTastiniCanzoneSelezionata(snap.val());

    });

};

function coloroTastiniCanzoneSelezionata(canzoneSelezionata) {
    var nomeCanzoneSelezionata = canzoneSelezionata.nome_canzone;
    var sequenzaCanzoneSelezionata = canzoneSelezionata.sequenza_note;
    for (z = 0; z < 50; z++) {
        valoreNota = sequenzaCanzoneSelezionata[z];
        if (valoreNota !== 0) {
            colonnaId = determinoIdColonna(z);
            classeCSSNota = "nota" + valoreNota;
            console.log(classeCSSNota);
            notaDaCheckare = document.getElementById(colonnaId).getElementsByClassName(classeCSSNota)[0];
            console.log(notaDaCheckare);
            notaDaCheckare.classList.remove("unchecked");
            notaDaCheckare.classList.add("checked");
        }
    }
}
//2.3.4.0.0.0.0...

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

pageLoad()
