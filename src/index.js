import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';

document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const catInfoDiv = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');
  select.style.display = 'none';

  // Function to initialize the page
  function initializePage() {
    loader.style.display = 'inline-block';
    errorElement.style.display = 'none';
    fetchAndPopulateBreeds();
  }

  // Function to fetch cat breeds and populate the dropdown
  function fetchAndPopulateBreeds() {
    fetchBreeds()
      .then(breeds => {
        breeds.forEach(breed => addOption(breed.id, breed.name));
      })
      .finally(() => {
        loader.style.display = 'none';
        select.style.display = 'inline-block';
      });
  }

  // Function to add options to the breed dropdown
  function addOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  }

  // Event listener for breed selection
  select.addEventListener('change', handleBreedSelection);

  // Function to handle breed selection
  function handleBreedSelection(event) {
    const selectedBreedId = event.target.value;

    if (selectedBreedId && selectedBreedId !== '') {
      loader.style.display = 'inline-block';
      catInfoDiv.style.display = 'none';
      fetchAndDisplayCatInfo(selectedBreedId);
    }
  }

  // Function to fetch and display cat information based on the selected breed
  function fetchAndDisplayCatInfo(breedId) {
    fetchCatByBreed(breedId)
      .then(catInfo => displayCatInfo(catInfo))
      .catch(handleError);
  }

  // Function to display cat information in the UI
  function displayCatInfo(catInfo) {
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

  // Function to handle errors during API calls
  function handleError(error) {
    Notiflix.Notify.failure('Error fetching cat information:', error);
    loader.style.display = 'none';
    errorElement.style.display = 'block';
  }

  // Initial page setup
  initializePage();
});
