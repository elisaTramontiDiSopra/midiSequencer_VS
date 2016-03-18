//link al database
//databaseLink = "https://midisequencer.firebaseio.com/";

function recuperaTitoliCanzoni() {
    //imposto il riferimento al database	
    var myFirebaseRef = new Firebase(databaseLink);
    myFirebaseRef.once('value', function (dataSnapshot) {
        //con .val prendo tutti i dati del mio database che si trovano dentro a datasnapshot e le ottengo come oggetto JS
        var tutteLeCanzoni = dataSnapshot.val();
        dataSnapshot.forEach(function (childSnapshot) {
            //vado a prendermi i valori della canzone singola
            var canzoneSingola = childSnapshot.val();
            var nomeCanzoneSingola = canzoneSingola.nome_canzone;
            var idCanzoneSingola = canzoneSingola.id;

            creaTastiCanzoni(nomeCanzoneSingola, idCanzoneSingola);
        });
    });
}

//creo i tasti delle canzoni con animazioni
function creaTastiCanzoni(nomeCanzoneSingola, id) {
    //tira via i pulsantoni con l'animazione
    var pulsantoneLista= document.getElementsById("archivioCanzoni");
    pulsantoneLista.classList.remove("bounceInDown");
    pulsantoneLista.classList.add("fadeOutLeft")

    var pulsantoneNuovaCanzone= document.getElementsById("nuovaCanzone");
    pulsantoneNuovaCanzone.classList.remove("bounceInDown");
    pulsantoneNuovaCanzone.classList.add("fadeOutRight")

    //creo i pulsantini per le singole canzoni
    var divCanzone = document.createElement("div");
    divCanzone.setAttribute('class', 'pulsanteCanzone fadeIn');
    songList = document.getElementById("songList");
    songList.appendChild(divCanzone);
    //metto il contenuto dentro il divCanzone
    var paragrafo = document.createElement("p");
    divCanzone.appendChild(paragrafo);

    //creo il link
    a = document.createElement('a');
    paragrafo.appendChild(a); //inserisco a in p 
    a.innerHTML = nomeCanzoneSingola
    a.href = "sequencer.html?id=" + id;
}