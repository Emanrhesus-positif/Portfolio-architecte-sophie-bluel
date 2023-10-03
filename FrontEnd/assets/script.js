
JSONrecup();

async function JSONrecup() {
   try {
      const response = await fetch('http://localhost:5678/api/works');
      const data = await response.json();
      Filters(data);
      PopulateWorks(data);
      Login();
   }
   catch (error) {
      console.error('Erreur :', error);
   }

}

function Filters(data) {

   const filterParent = document.querySelector('#portfolio');
   const gallery = document.querySelector('.gallery');

   const filterContainer = document.createElement('div');
   filterContainer.classList.add('filter-container');

   const filterTous = document.createElement('button');
   filterTous.classList.add("filter");
   filterTous.innerText = "Tous";

   const filterObjects = document.createElement('button');
   filterObjects.classList.add("filter");
   filterObjects.innerText = "Objets";

   const filterAppartements = document.createElement('button');
   filterAppartements.classList.add("filter");
   filterAppartements.innerText = "Appartements";

   const filterHR = document.createElement('button');
   filterHR.classList.add("filter");
   filterHR.innerText = "Hôtels & Restaurants";

   filterTous.addEventListener("click", function (){
      PopulateWorks(data);
      UpdateButtonColor(filterTous);
   });
   filterObjects.addEventListener("click", function (){
      PopulateWorks(data, 1);
      UpdateButtonColor(filterObjects);
   });
   filterAppartements.addEventListener("click", function (){
      PopulateWorks(data, 2);
      UpdateButtonColor(filterAppartements);
   });
   filterHR.addEventListener("click", function (){
      PopulateWorks(data, 3);
      UpdateButtonColor(filterHR);
   });

   filterParent.appendChild(filterContainer);
   filterParent.appendChild(gallery);

   filterContainer.appendChild(filterTous);
   filterContainer.appendChild(filterObjects);
   filterContainer.appendChild(filterAppartements);
   filterContainer.appendChild(filterHR);

}

function PopulateWorks(data, filter) {
   const container = document.querySelector('.gallery');
   container.innerHTML = "";

   let datafiltered = data;

   if(filter != undefined){
      datafiltered = data.filter(data => data.categoryId === filter);
   }
   
   datafiltered.forEach((item) => {

      const figure = document.createElement('figure');

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title;

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = item.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      container.appendChild(figure);
   });
}

function UpdateButtonColor(clickedButton){
   const filterButton = document.querySelectorAll('.filter');
   filterButton.forEach((button) => {
      button.classList.remove('active');
   });
   clickedButton.classList.add('active');
}

function Send(){

   //exemple de post
   fetch("http://localhost:5678/api/works", {
      method: "POST",                                 //protocole
      headers: {"Content-Type" : "application/json"}, //format
      body : JSON.stringify('{"valeur": "info"}')                     //Charge Utile
   });
}

function Modify(){
   //TODO créer une pop up contenant : de quoi la quitter, titre Galerie photo, l'extraction de toutes les images des works sans les noms
   //TODO ,un séparateur et un bouton Ajouter une photo
   //TODO sur chaque photo une icone qui renvoie sur delete le work associé
}

function AddPicture(){
   //TODO créer une pop up pour l'upload de l'image, Nom et Catégorie
}

function Login() {
 //TODO renvoyer sur la page de login si non connecté / vérifier le token de connexion si deja connecté
 

}
function CreateWork(){

}
function DeleteWork(){

}
function IsConnected(){
   try{
      const test = localStorage.getItem("Soblutoken");

   }
   catch(error){

   }
   

}
// TODO bosser la gestion du dataset
// html
// <figure data-workid="1"></figure> //dataset

// const response : [{id : 1,image:idfijsd }] //exemple

// response.forEach() //pour le travailler

// const ee = e.target.parentNode: //recup le parent de l'élément courant comme le bouton
// ee.remove(); //pour supprimer le parent par exemple

//TODO récup du token en session ou localstorage et le vérifier
//TODO afficher le bouton de modif des travaux, virer les filtres
//TODO bouton modif : ouverture de la modale 1 supression de la liste des items
//TODO si connecté : dataset des travaux pour leur affichage et suppression simultanés du backboard et de la modale
//TODO si non connecté : actuel donc if token true > nouvelle fonct et if token false : >JSONrecup par exemple
//TODO creer la modale 2 pour l'enregistrement de l'image et le stockage de son lien + nom + catégorie
//TODO gérer la partie CSS 
//droit d'ajouter du CSS mais vaut mieux le garder en bas pour montrer ce qui change
//attention session = disparait quand on ferme l'onglet, local présent en dur sur le disque