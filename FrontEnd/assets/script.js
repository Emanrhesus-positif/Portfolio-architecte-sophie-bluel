async function fetchAndDisplayJSON() {
    try {
      const response = await fetch('127.0.0.1');

      if (!response.ok) {
        throw new Error('La requête a échoué avec le statut ' + response.status);
      }      const data = await response.json();
      const container = document.querySelector('.gallery');
      

      data.forEach((item) => {
        const figure = document.createElement('figure');
        
        const img = document.createElement('img');
        img.src = item.imageURL; 
        img.alt = item.title; 
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = item.title; 
        

        figure.appendChild(img);
        figure.appendChild(figcaption);
        
        container.appendChild(figure);
      });
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
    }
  }
  
  //TODO changer tous les appels une fois connus
  fetchAndDisplayJSON();