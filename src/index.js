import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
window.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const catInfoDiv = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');

  loader.style.display = 'none';

  window.addEventListener('load', () => {
    // Fetch cat breeds and populate the dropdown

    fetchBreeds().then(breeds => {
      for (const breed of breeds) {
        addOption(breed.id, breed.name);
      }
    });

    // Hide error element initially

    errorElement.style.display = 'none';
  });

  // Function to add options to the breed dropdown

  function addOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
    console.log(option);
  }

  select.addEventListener('change', event => {
    const selectedBreedId = event.target.value;

    if (selectedBreedId && selectedBreedId !== '') {
      loader.style.display = 'inline-block';
      catInfoDiv.style.display = 'none';

      // Fetch cat information based on the selected breed

      fetchCatByBreed(selectedBreedId)
        .then(catInfo => {
          displayCatInfo(catInfo);
        })
        .catch(error => {
          Notiflix.Notify.failure('Error fetching cat information:', error);
          loader.style.display = 'none';
          errorElement.style.display = 'block';
        });
    }
  });

  // Function to display cat information in the UI

  function displayCatInfo(catInfo) {
    console.log('Cat Info:', catInfo);

    if (catInfo && catInfo.length > 0) {
      const { url, breeds } = catInfo[0];

      if (breeds && breeds.length > 0) {
        const { name, description, temperament } = breeds[0];

        // Generate HTML markup for displaying cat information

        const catMarkup = `
          <div class="cat-info">
            <img src="${url}" alt="Cat Image" class="cat-image">
            <div class="cat-details">
              <p class="cat-name"><strong>${name}</strong></p>
              <p class="cat-text" >${description}</p>
              <p><strong>Temperament:</strong> ${temperament}</p>
            </div>
          </div>`;

        // Update the cat information container and display it

        catInfoDiv.innerHTML = catMarkup;
        catInfoDiv.style.display = 'block';
        loader.style.display = 'none';
      } else {
        Notiflix.Notify.failure('Invalid cat breed data received:', catInfo);
        catInfoDiv.innerHTML =
          '<p>No information available for this cat breed.</p>';
      }
    } else {
      Notiflix.Notify.failure('Invalid cat data received:', catInfo);
      catInfoDiv.innerHTML = '<p>No information available for this cat.</p>';
      errorElement.style.display = 'block';
      loader.style.display = 'none';
    }
  }
  console.log('Select:', select);
  console.log('Loader:', loader);
  console.log('CatInfoDiv:', catInfoDiv);
});
