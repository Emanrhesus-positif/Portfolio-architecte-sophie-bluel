

IsConnected();
function IsConnected(){ //vérifie si un token existe
   try{
      const token = localStorage.getItem("Soblutoken");

      if(token){
         LoadPage(true);
      }
      else{
         LoadPage(false);
      }
   }
   catch(error){
      console.log(error);
   }
   

}
async function LoadPage(isConnected) {//choix d'affichage selon présence ou absence de token
   try {
      const response = await fetch('http://localhost:5678/api/works');
      const data = await response.json();
      if (isConnected){
         PopulateWorks(data);
         UserLevel();
      }
      else{
         Filters(data);
         PopulateWorks(data);
      }

   }
   catch (error) {
      console.error('Erreur :', error);
   }

}
function Filters(data) {//affiche les filtres et les positionne

   const filterParent = document.querySelector('#portfolio'); //parent
   const gallery = document.querySelector('.gallery'); //conteneur

   const filterContainer = document.createElement('div'); //div des elements
   filterContainer.classList.add('filter-container'); //pour le style

   const filterTous = document.createElement('button'); //bouton TOUS
   filterTous.classList.add("filter");
   filterTous.innerText = "Tous";

   const filterObjects = document.createElement('button'); //bouton OBJETS
   filterObjects.classList.add("filter");
   filterObjects.innerText = "Objets";

   const filterAppartements = document.createElement('button'); //Bouton APPARTEMENTS
   filterAppartements.classList.add("filter");
   filterAppartements.innerText = "Appartements";

   const filterHR = document.createElement('button'); //bouton Hôtels et restaurants
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

   filterParent.appendChild(filterContainer); //affectations et répartition des filtres
   filterParent.appendChild(gallery);

   filterContainer.appendChild(filterTous);
   filterContainer.appendChild(filterObjects);
   filterContainer.appendChild(filterAppartements);
   filterContainer.appendChild(filterHR);

}
function PopulateWorks(data, filter) { //affiche les travaux selon le filtre sélectionné
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

      figure.dataset.workid = item.id;

      container.appendChild(figure);
   });
}
function UserLevel(){ //affiche les éléments pour un utilisateur disposant d'un token
   const login = document.getElementById("login"); //change login en logout et son comportement
   login.innerText = "logout";
   login.addEventListener("click",()=>{
      localStorage.removeItem("Soblutoken");
      login.setAttribute("href", "#");
      window.location.reload();
   });

   const modDiv = document.createElement('div'); //conteneur de l'icone et du lien

   const modIcon = document.createElement("span"); //l'icone de modification
   modIcon.classList.add("material-symbols-rounded");
   modIcon.innerText = "edit_square";

   const modLink = document.createElement('a'); //lien cliquable pour la modale
   modLink.innerText = "modifier";
   modDiv.addEventListener('click', () => {
      ModalSuppressPhoto();
   });

   modDiv.appendChild(modIcon); //placement des éléments à côté de Mes projets
   modDiv.appendChild(modLink);
   const h2 = document.querySelector('#portfolio h2');
   h2.insertAdjacentElement('afterend', modDiv);
}
function UpdateButtonColor(clickedButton){ //Change la couleur de fond des filtres
   const filterButton = document.querySelectorAll('.filter');
   filterButton.forEach((button) => {
      button.classList.remove('active');
   });
   clickedButton.classList.add('active');
}
function ModalSuppressPhoto(){//création de la modale de modification des travaux
   const modal = document.createElement('div'); //container
   modal.classList.add('modal');
   modal.role = "dialog";
   modal.ariaModal = true;
   modal.ariaLabel = "Titre";

   const cache = document.createElement('cache'); //backbox
   cache.classList.add("cache");
   document.body.appendChild(cache);

   const closeButton = document.createElement('span'); //bouton de fermeture
   closeButton.classList.add("material-symbols-rounded");
   closeButton.classList.add("closeButton");
   closeButton.innerText = "close";
   closeButton.addEventListener("click", () => {
      cache.remove();
      modal.remove();
   });

   const title = document.createElement('h3'); //titre
   title.innerText = "Galerie photo";

   const gallery = document.createElement('div'); //gallerie
   gallery.classList.add('gallery');
   PopulateDeletableWorks();

   const separator = document.createElement('hr'); //ligne séparatrice
   separator.classList.add('separator');

   const addPicture = document.createElement('button');
   addPicture.innerText = "Ajouter une photo";
   addPicture.addEventListener("click", () => {
      ModalAddPicture();
   });


   modal.appendChild(closeButton);
   modal.appendChild(title);
   modal.appendChild(gallery);
   modal.appendChild(separator);
   modal.appendChild(addPicture);
   document.body.appendChild(modal);

}
async function PopulateDeletableWorks(){ //récupération des travaux pour la modale

   try {
      const response = await fetch('http://localhost:5678/api/works');
      const data = await response.json();
      FillModGallery(data);
   }
   catch (error) {
      console.error('Erreur :', error);
   }
}
function FillModGallery(data){ //création des éléments de la gallerie de la modale et de leurs destructeurs
   const container = document.querySelector('.modal .gallery');
   container.innerHTML = "";
   data.forEach((item) => {

      const figure = document.createElement('figure'); //conteneur du travail

      const img = document.createElement('img'); //image
      img.src = item.imageUrl;
      img.alt = item.title;
      figure.dataset.workid = item.id;

      const destructor = document.createElement('button'); //suppression travail
      destructor.type = "button";
      destructor.classList.add('delete');
      const trashCan = document.createElement('span');
      trashCan.classList.add('material-symbols-rounded');
      trashCan.innerText = "delete";

      destructor.addEventListener("click", (event) =>{ 
         event.preventDefault();
         const element = document.querySelectorAll('[data-workid]');
         element.forEach((item) => {
            if(item.getAttribute('data-workid') === figure.dataset.workid){
               item.remove();
            }
         });
         let boulethein = DeleteWork(figure.dataset.workid, event);
         console.log(boulethein);
      });

      destructor.appendChild(trashCan);
      figure.appendChild(img);
      figure.appendChild(destructor);

      container.appendChild(figure);
   });
}
async function DeleteWork(id, event){ //DELETE envoi avec id de la photo à détruire
   
   try{
      event.preventDefault(); //probleme de portée d'event ? peut être le déclencher ici
      const token = localStorage.getItem("Soblutoken");
      const sendDeletion = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type" : "application/json",
               "Authorization": `Bearer ${token}`
            }
      });
      event.preventDefault(); //probleme de portée d'event ? peut être le déclencher ici
      if(sendDeletion.status === 204)
      {
         console.log("Suppression réussie");
         return false;
      }
      else{
         const answer = await sendDeletion.json();
         console.log(answer.status);
      }
      
   }
   catch(error){
      console.log("Erreur :  "+ error);
   }
}
function ModalAddPicture(){ //fonction de création de la modale d'upload photo
   const deleteModal = document.querySelector('.modal'); //supression de la derniere fenêtre modale
   deleteModal.remove();

   const cache = document.querySelector('.cache'); //backbox récupérée de la derniere modale

   const modal = document.createElement('div'); //container pour la modale
   modal.classList.add('modal');
   modal.role = "dialog";
   modal.ariaModal = true;
   modal.ariaLabel = "Titre";

   const closeButton = document.createElement('span'); //bouton de fermeture
   closeButton.classList.add("material-symbols-rounded");
   closeButton.classList.add("closeButton");
   closeButton.innerText = "close";
   closeButton.addEventListener("click", () => {
      cache.remove();
      modal.remove();
   });

   const backButton = document.createElement('span'); //bouton de retour
   backButton.classList.add("material-symbols-rounded");
   backButton.classList.add("backButton");
   backButton.innerText = "arrow_back";
   backButton.addEventListener("click", () => {
      cache.remove();
      modal.remove();
      ModalSuppressPhoto();
   });

   const modalTitle = document.createElement('h3'); //titre de la modale
   modalTitle.innerText = "Ajout Photo";

   const form = document.createElement('form'); //formulaire pour l'envoi du nouveal travail
   form.id = "contact";

   const pictureContainer = document.createElement('input'); //container image
   pictureContainer.type = "file";
   pictureContainer.accept = "image/*";
   pictureContainer.classList.add("imageInput");
   pictureContainer.id = "file";
   const pictureField = document.createElement('div'); //zone de dépôt image

   const labelTitle = document.createElement("label"); //titre image
   labelTitle.htmlFor = "title";
   labelTitle.innerText = "Titre";
   const pictureTitle = document.createElement("input"); 
   pictureTitle.type = "text";
   pictureTitle.id = "title";
   pictureTitle.name = "title";

   const labelCategory = document.createElement("label"); //catégorie image
   labelCategory.htmlFor = "category";
   labelCategory.innerText = "Catégorie";
   const pictureCategory = document.createElement("select");
   pictureCategory.id = "category";
   pictureCategory.name = "category";
   pictureCategory.options.add(new Option("Objet", 1));
   pictureCategory.options.add(new Option("Appartement", 2));
   pictureCategory.options.add(new Option("Hôtel / Restaurant", 3));

   const separator = document.createElement('hr'); //ligne séparatrice
   separator.classList.add('separator');

   const addPicture = document.createElement('button'); // envoi du formulaire
   addPicture.innerText = "Valider";
   addPicture.addEventListener("click", (e) => {
      e.preventDefault();
      SendPicture();
   });

   modal.appendChild(closeButton); //placement des objets dans l'ordre dans la modale
   modal.appendChild(backButton);
   modal.appendChild(modalTitle);
   modal.appendChild(form);
   form.appendChild(pictureField); //attention
   pictureField.appendChild(pictureContainer); //attention
   form.appendChild(labelTitle);
   form.appendChild(pictureTitle);
   form.appendChild(labelCategory);
   form.appendChild(pictureCategory);
   form.appendChild(separator);
   form.appendChild(addPicture);
   document.body.appendChild(modal);
}
async function SendPicture(){
   try{
      const imageInput = document.getElementById('file');
      const title = document.querySelector('#title').value;
      const category = document.querySelector('#category').value;
      const token = localStorage.getItem("Soblutoken");

      const formData = new FormData();
      formData.append('image', imageInput.files[0]);
      formData.append('title', title);
      formData.append('category', category);
      
      const sendPic = await fetch("http://localhost:5678/api/works", {
         method: "POST",
         headers: {"Authorization" : `Bearer ${token}`},
         body: formData
      });
      const answer = await sendPic.json();
      console.log(answer.status);
   }
   catch (error){
      console.log(error);
   }
}
function SavePicture(){
   const picture = document.getElementById("file");
   //voir les formdata
   const formImage = new FormData("");
}
//TODO gérer la partie CSS 
//TODO enlever le rechargement de page a la supression d'un travail ???? probleme de DELETE tester avec une div au lieu d'un button
//TODO evolution : extraire categories et peupler la création d'images avec.


