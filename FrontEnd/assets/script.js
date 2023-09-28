JSONrecup();

async function JSONrecup() {
   try {
      const response = await fetch('http://localhost:5678/api/works');
      const data = await response.json();
      Filters(data);
      PopulateWorks(data);
   }
   catch (error) {
      console.error('Erreur :', error);
   }

}

function Filters(data) {

   const filterParent = document.querySelector('#portfolio');
   const gallery = document.querySelector('.gallery');

   const filterContainer = document.createElement('div');

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
   });
   filterObjects.addEventListener("click", function (){
      PopulateWorks(data, 1);
   });
   filterAppartements.addEventListener("click", function (){
      PopulateWorks(data, 2);
   });
   filterHR.addEventListener("click", function (){
      PopulateWorks(data, 3);
   });

   filterParent.appendChild(filterContainer); 
   filterContainer.appendChild(filterTous);
   filterContainer.appendChild(filterObjects);
   filterContainer.appendChild(filterAppartements);
   filterContainer.appendChild(filterHR);
   filterContainer.appendChild(gallery);


   console.log(document.body.innerHTML);
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

function Send(){

   //exemple de post
   fetch("http://localhost:5678/api/works", {
      method: "POST",                                 //protocole
      headers: {"Content-Type" : "application/json"}, //format
      body : '{"valeur": "info"}'                     //Charge Utile
   });
}
