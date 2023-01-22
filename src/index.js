import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { restCountries } from './restcountries';

const DEBOUNCE_DELAY = 300;
const inputText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputText.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
    clear();
  const name = e.target.value.trim();
 if (!name) {
   return;
 }
restCountries(name)
   .then(renderMarkup)
   .catch(error => Notify.failure('Oops, there is no country with that name'));  
}

function renderMarkup(data) {
    if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    }
    if ((data.length <= 10) & (data.length > 1)) {
        renderMarkupCountry(data);
    }
    if (data.length === 1) {
        renderMarkupInfo(data);
    }
}

function renderMarkupCountry(fields) {
  const markup = fields
    .map(({ flags, name }) => {
      return `
        <li style='list-style: none; margin-bottom:15px; display: flex'>
          <img src='${flags.svg}' alt='flags' width='100'/>
          <p style='margin-left:10px; font-size:25px'><b>${name.official}</b></p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderMarkupInfo(fields) {
  const markup = fields
    .map(({ flags, name, capital, population, languages }) => {
          return `<div style='display: flex'>
        <img src='${flags.svg}' alt='flags' width='200'/>
        <p style='margin-left:15px; font-size: 35px'><b>${name.official}</b></p>
        </div>
        <p style='font-size: 25px'><b>Capital:</b> ${capital}</p>
        <p style='font-size: 25px'><b>Population:</b> ${population}</p>
        <p style='font-size: 25px'><b>Languages:</b> ${Object.values(
          languages
        )}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function clear() {
countryList.innerHTML = '';
countryInfo.innerHTML = '';
}

