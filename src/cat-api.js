import axios from 'axios';
import Notiflix from 'notiflix';
export const ENDPOINT = 'https://api.thecatapi.com/v1';
export const API_KEY =
  'live_BLGKcai2NyLETr1i4Pw6Nrey2OIBQv0uX9xVSOXPljLZZydAmezbW4wIaI7Ljqok';
axios.defaults.headers.common['x-api-key'] =
  'live_BLGKcai2NyLETr1i4Pw6Nrey2OIBQv0uX9xVSOXPljLZZydAmezbW4wIaI7Ljqok';

// Function to fetch cat breeds

export function fetchBreeds() {
  return axios
    .get(`${ENDPOINT}/breeds`)
    .then(response => response.data)

    .catch(error => {
      Notiflix.Notify.failure('Failed to fetch breeds', error);
      throw error;
    });
}

// Function to fetch cat information by breed

export function fetchCatByBreed(breedId) {
  return axios
    .get(`${ENDPOINT}/images/search?breed_ids=${breedId}`)
    .then(response => {
      console.log('Cat API Response:', response.data);
      return response.data;
    })
    .catch(error => {
      Notiflix.Notify.failure('Error fetching cat information:', error);
    });
}
