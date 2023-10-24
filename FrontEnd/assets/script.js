

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
async function LoadPage(isConnected) { //GET des travaux + choix d'affichage selon présence ou absence de token
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
async function Filters(data) { //affiche les filtres et les positionne

   const filterParent = document.querySelector('#portfolio'); //parent
   const gallery = document.querySelector('.gallery'); //conteneur

   const filterContainer = document.createElement('div'); //div des elements
   filterContainer.classList.add('filter-container'); //pour le style

   const filterTous = document.createElement('button'); //bouton TOUS
   filterTous.type = "button";
   filterTous.classList.add("filter");
   filterTous.innerText = "Tous";
   filterTous.addEventListener("click", function (){
      PopulateWorks(data);
      UpdateButtonColor(filterTous);
   });

   filterParent.appendChild(filterContainer); //affectations et répartition des filtres
   filterParent.appendChild(gallery);

   filterContainer.appendChild(filterTous);

   const test = await GetCategories();
   PopulateFilters(test, data); //création et ajout des autres boutons de filtrage
   UpdateButtonColor(filterTous); //chargé par défaut

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
   modDiv.classList.add('modify');
   const myProjects = document.querySelector('#portfolio h2');

   const modIcon = document.createElement("span"); //l'icone de modification
   modIcon.classList.add("material-symbols-rounded", "editIcon");
   modIcon.innerText = "edit_square";

   const modLink = document.createElement('a'); //lien cliquable pour la modale
   modLink.innerText = "modifier";
   modDiv.addEventListener('click', () => {
      ModalSuppressPhoto();
   });

   modDiv.appendChild(myProjects); //placement des éléments
   modDiv.appendChild(modIcon);
   modIcon.appendChild(modLink);
   const portfolio = document.querySelector('#portfolio');
   portfolio.prepend(modDiv);

}
function UpdateButtonColor(clickedButton){ //Change la couleur de fond des filtres
   const filterButton = document.querySelectorAll('.filter');
   filterButton.forEach((button) => {
      button.classList.remove('active');
   });
   clickedButton.classList.add('active');
}
function ModalSuppressPhoto(){ //création de la modale de modification des travaux
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

   const addPicture = document.createElement('button'); //bouton d'ouverture de la modale d'ajout
   addPicture.type = "button";
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
      figure.dataset.workid = item.id; //identifiant unique pour gérer la supression

      const destructor = document.createElement('button'); //suppression travail
      destructor.type = "button";
      destructor.classList.add('delete');
      const trashCan = document.createElement('span');
      trashCan.classList.add('material-symbols-rounded');
      trashCan.innerText = "delete";

      destructor.addEventListener("click", (event) =>{ //récupere tous les travaux et en fonction du work-id cible, supprime l'élément du dom dans les deux galleries
         event.preventDefault();
         const element = document.querySelectorAll('[data-workid]');
         element.forEach((item) => {
            if(item.getAttribute('data-workid') === figure.dataset.workid){
               item.remove();
            }
         });
         DeleteWork(figure.dataset.workid);
      });

      destructor.appendChild(trashCan);
      figure.appendChild(img);
      figure.appendChild(destructor);

      container.appendChild(figure);
   });
}
async function DeleteWork(id){ //DELETE envoi avec id de la photo à détruire
   
   try{
      const token = localStorage.getItem("Soblutoken");
      const sendDeletion = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type" : "application/json",
               "Authorization": `Bearer ${token}`
            }
      });
      if(sendDeletion.status === 204)
      {
         console.log("Suppression réussie");
         return ;
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
async function ModalAddPicture(){ //Création de la modale d'upload photo
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

   const form = document.createElement('form'); //formulaire pour l'envoi du nouveau travail
   form.id = "formPicture";

   const pictureContainer = document.createElement('input'); //container image
   pictureContainer.type = "file";
   pictureContainer.accept = "image/*";
   pictureContainer.classList.add("imageInput");
   pictureContainer.id = "file";

   const pictureField = document.createElement('div'); //zone de dépôt image qui prend le comportement de l'input
   pictureField.classList.add('field');
   pictureField.addEventListener("click",()=>{
      pictureContainer.click();
   });

   const uploadIcon = document.createElement('span'); //image de la zone image
   uploadIcon.classList.add("material-symbols-rounded");
   uploadIcon.classList.add("upload-icon");
   uploadIcon.classList.add("imagesmode");
   uploadIcon.innerText = "imagesmode";

   const ajoutImageBtn = document.createElement('button'); //faux bouton d'upload
   ajoutImageBtn.type = "button";
   ajoutImageBtn.classList.add("upload-btn");
   ajoutImageBtn.id = "upload-btn";
   ajoutImageBtn.innerText = "+ Ajouter photo";
   ajoutImageBtn.addEventListener("click",(e)=>{
      e.preventDefault();
   });

   const acceptedFormat = document.createElement('p'); // texte des formats autorisés
   acceptedFormat.classList.add("upload-description");
   acceptedFormat.innerText = "jpg, png : 4Mo max";

   const imageUploaded = document.createElement('img'); //emplacement de l'image uploadée
   imageUploaded.classList.add("selected-image");
   imageUploaded.alt = "Image Sélectionnée";

   pictureContainer.addEventListener("change", (e) => {
      ChangeEventUpload(pictureContainer, imageUploaded)
   });

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

   const retCat = await GetCategories();
   PopulateCategories(pictureCategory, retCat);

   const separator = document.createElement('hr'); //ligne séparatrice
   separator.classList.add('separator');

   const addPicture = document.createElement('button'); // envoi du formulaire
   addPicture.innerText = "Valider";
   addPicture.type = "button";
   addPicture.id = "validate";
   addPicture.setAttribute('disabled', 'disabled');
   addPicture.classList.add('notActive');
   addPicture.addEventListener("click", (e) => {
      e.preventDefault();
      SendPicture(cache, modal);
   });

   const list = [
      pictureContainer,
      pictureTitle,
      pictureCategory
   ];
   ModifyPictureFields(list, addPicture);

   pictureField.appendChild(uploadIcon); //placement des populateurs de la div image
   pictureField.appendChild(ajoutImageBtn);
   pictureField.appendChild(acceptedFormat);
   pictureField.appendChild(pictureContainer);
   pictureField.appendChild(imageUploaded);

   form.appendChild(pictureField);
   form.appendChild(labelTitle);
   form.appendChild(pictureTitle);
   form.appendChild(labelCategory);
   form.appendChild(pictureCategory);
   form.appendChild(separator);
   form.appendChild(addPicture);

   modal.appendChild(closeButton); 
   modal.appendChild(backButton);
   modal.appendChild(modalTitle);
   modal.appendChild(form);
   document.body.appendChild(modal);
}
async function GetCategories(){
   const token = localStorage.getItem("Soblutoken");
   try{
      const response = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: {"Content-Type" : "application/json",
               "Authorization" : `Bearer ${token}`}
   });
   const data = await response.json();
   return data;
   }
   catch(e){
      console.log("error on " + e);
      console.log(data);
   }
   
}
function PopulateCategories(pictureCategory, data){
   pictureCategory.options.add(new Option("", ''));
   data.forEach((item) => {
      pictureCategory.options.add(new Option(item.name, item.id));
   });
}
async function SendPicture(cache, modal){ // POST envoi avec tous les éléments du travail
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
      const answer = await sendPic.json(); //récupération du retour d'image et affichage dans la gallerie
      const container = document.querySelector('.gallery');
      const figure = document.createElement('figure');

      const img = document.createElement('img');
      img.src = answer.imageUrl;
      img.alt = answer.title;

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = answer.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      figure.dataset.workid = answer.id;

      container.appendChild(figure);

      cache.remove();
      modal.remove();
      
   }
   catch (error){
      console.log(error);
   }
}
function ModifyPictureFields(list, addPicture){ //gestion du contrôle de completion des champs d'image
   list.forEach((field)=>{
      field.addEventListener("input", () =>{
         if (CheckPictureFields()){
            addPicture.removeAttribute('disabled');
            addPicture.classList.remove('notActive');
         }
         else{
            addPicture.setAttribute('disabled', 'disabled');
            addPicture.classList.add('notActive');
         }
      });
   });
}
function CheckPictureFields(){ //vérifie si tous les champs d'upload sont bien remplis
   const image = document.getElementById('file');
   const title = document.getElementById('title');
   const category = document.getElementById('category');
   if (image.files.length > 0 && title.value !== '' && category.value !== ''){
      return true;
   }
   else{
      return false;
   }
}
function ChangeEventUpload(pictureContainer, imageUploaded){ //met une image dans la div d'upload avant la validation 
   if (pictureContainer.files && pictureContainer.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
         imageUploaded.src = e.target.result;
         imageUploaded.style.display = "block"; //affichage de la div de placement de l'image et supression de tous les éléments graphiques pour l'upload
         document.querySelector('.upload-icon').remove();
         document.querySelector('.upload-btn').remove();
         document.querySelector('.upload-description').remove();
      };
      reader.readAsDataURL(pictureContainer.files[0]);
   }
}

function PopulateFilters(category, data){//génération des boutons des filtres
   const filterContainer = document.querySelector(".filter-container");
   category.forEach((item)=>{
      let filter = document.createElement('button');
      filter.type = "button";
      filter.classList.add("filter");
      filter.innerText = item.name;
      filter.id = item.id;
      console.log(item);

   filter.addEventListener("click", function (){
      PopulateWorks(data, item.id);
      UpdateButtonColor(filter);

   });
   filterContainer.appendChild(filter);
   });
}



   

