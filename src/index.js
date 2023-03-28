import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetch-countries.js';
const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}


refs.searchBox.addEventListener(
  'input',
  debounce(handleCountryInput, DEBOUNCE_DELAY)
);

function handleCountryInput(e) {
 
    const inputValue = e.target.value.trim();
  if (inputValue === '') {
    clearMarkUp();
    return;
  }
    fetchCountries(inputValue)
    .then(data => {
        checkCountriesArray(data);
      
    })
    .catch(() => {
        onError();
    });

  
}
function onError() {
clearMarkUp();
Notiflix.Notify.failure('Oops, there is no country with that name');
}

function checkCountriesArray(data) {
if (data.length > 10) {
        clearMarkUp();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length <= 10 && data.length > 1) {
        clearMarkUp();
        createCountriesMarkUp(data);
        return;
      }
    clearMarkUp();
    createCountryMarkUp(data);
}

function createCountriesMarkUp(countries) {
  countries.map(({ flags, name }) => {
    refs.countryList.insertAdjacentHTML(
      'beforeend',
      `
        <li class="country-list__item">
          <img width="25"
            class="country-flag"
            src="${flags.svg}"
            alt="flag of ${name.official}"
          >
          <p class="country-name">${name.official}</p>
        </li>
      `
    );
  });
}

function createCountryMarkUp(country) {
  country.map(({ name, flags, capital, population, languages }) => {
    refs.countryInfo.insertAdjacentHTML(
      'beforeend',
      `<div class="country__wrapper"><img src='${
        flags.svg
      }' class="country-flag" width ="50" alt='flag of ${name.official}' />
  <h2 class='country-name'>${name.official}</h2></div>
  <ul class='country-info__list'>
    <li class='country-info__item'>
      <p class='capital-name'><span class='subtitle'>Capital: </span>
        ${capital}</p>
    </li>
    <li class='country-info__item'>
      <p class='population'><span class='subtitle'>Population: </span>
        ${population}</p>
    </li>
    <li class='country-info__item'>
      <p class='languages'><span class='subtitle'>Languages: </span>
        ${Object.values(languages)}</p>
    </li>
  </ul>
      `
    );
  });
}

function clearMarkUp() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}