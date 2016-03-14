databaseLink = "https://midisequencer.firebaseio.com/";		//db su firebase
var myFirebaseRef = new Firebase(databaseLink)


myFirebaseRef.authWithPassword({
    email: "midisequencer@gmail.com",
    password: "password"
}, function (error, authData) {
    if (error) {
        switch (error.code) {
            case "INVALID_EMAIL":
                console.log("The specified user account email is invalid.");
                break;
            case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
            case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
            default:
                console.log("Error logging user in:", error);
        }
    } else {
        console.log("Authenticated successfully with payload:", authData);
    }
});