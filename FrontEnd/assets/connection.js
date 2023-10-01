//TODO récup et stocker le token en sessionstorage ou localstorage
//TODO retour à la page index sur la même page
const sendBtn = document.querySelector('form');
let email = "email";
let password = "password";

sendBtn.addEventListener("submit", function (event) {
    event.preventDefault();
    LoginAttempt();
});



function CreateUser(){


 }

 async function LoginAttempt(){
    

    // gestion du token et de l'id

    //TODO englober dans un try catch pour gérer les codes d'erreur de retour, 200 nickel on continue, 401 pas le droit, 404 utilisateur inconnu de la bdd


    try{
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;

        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",                                 //protocole
            headers: {"Content-Type" : "application/json"}, //format
            body : JSON.stringify({
                 "email": email,
                 "password": password
            })
        });
        const connect = await reponse.json();
        console.log("envoi réussi de la tentative");
        console.log(connect);
        if (reponse.status === 404){

        }
        switch (reponse.status){
            case 404:
                console.log("user not found");
                break;
            case 401:
                console.log("user forbidden");
                break;
            case 200:
                console.log("user correct");
                Retour();
                break;
            default:
                console.log("erreur de retour");
                break;
        }

    }
    catch(error){
        console.error('echec :', error);
    }
 }

 function Retour(){

 }