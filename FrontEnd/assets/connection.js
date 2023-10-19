
const sendBtn = document.querySelector('form');
let email = "email";
let password = "password";

sendBtn.addEventListener("submit", function (event) {
    event.preventDefault();
    LoginAttempt();
});
 async function LoginAttempt(){

    try{
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;

        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body : JSON.stringify({
                 "email": email,
                 "password": password
            })
        });
        const connect = await reponse.json();
        const token = connect.token;
        StatusCheck(reponse.status, token);

    }
    catch(error){
        console.error('echec :', error);
    }
    
 }
 function TokenSave(token){
    localStorage.setItem("Soblutoken", token);
 }
 function RemoveToken(){
    localStorage.removeItem("Soblutoken");
 }
 function StatusCheck(status, token){
    const userInfo = document.createElement("div");
    const parent = document.getElementById("connector");

    if(status === 200){
        console.log("user correct");
        TokenSave(token);
        window.location.href = "./index.html";
    }
    else
    {
        ShowErrorType(status);
    }

    parent.appendChild(userInfo);
 }
function ShowErrorType(error){
    const errorDiv = document.createElement('div');
    const section = document.querySelector('section');

    switch (error){
        case 404:
            console.log("user not found");
            errorDiv.innerText = "email et/ou mot de masse incorrects";
            errorDiv.style.backgroundColor = "orange";
            break;
        case 401:
            console.log("user forbidden");
            errorDiv.innerText = "Accès interdit";
            errorDiv.style.backgroundColor = "red";
            break;
        default:
            console.log("erreur de retour");
            break;
    }
    section.appendChild(errorDiv);
}
