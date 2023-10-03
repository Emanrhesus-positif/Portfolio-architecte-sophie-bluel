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
        const token = JSON.stringify(connect);
        StatusCheck(reponse.status, token);

    }
    catch(error){
        console.error('echec :', error);
    }
    
 }

 function TokenSave(token){
    localStorage.setItem("Soblutoken", token);
    const test = localStorage.getItem("Soblutoken");
    console.log(test);
 }
 function RemoveToken(){
    localStorage.removeItem("Soblutoken");
 }

 function StatusCheck(status, token){
    const userInfo = document.createElement("div");
    const parent = document.getElementById("contact");

    switch (status){
        case 404:
            console.log("user not found");
            //donner une classe avec une couleur CSS et mettre le texte dans la new div
            break;
        case 401:
            console.log("user forbidden");
            break;
        case 200:
            console.log("user correct");
            TokenSave(token);
            window.location.href = "./index.html";
            break;
        default:
            console.log("erreur de retour");
            break;
    }

    parent.appendChild(userInfo);
 }
