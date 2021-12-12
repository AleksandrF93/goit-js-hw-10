import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchForm: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
    countryList: document.querySelector('.country-list') 
}

function onSearch(e) {
    e.preventDefault();
    const searchCountry = e.target.value.trim();
    if (!searchCountry.length) {
        clinPage();
        return;
    }
    API.fetchCountry(searchCountry)
        .then(response => {
            if (!response.ok) {
            throw new Error(response.status);
            }
            return response.json();
        })
        .then(country => {
            clinPage();
            countryReceived(country);
        })
        .catch(onError);
};
refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

const countryReceived = array => {
    if (array.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (array.length > 1 && array.length <= 10) {
    renderList(array);
    } else if (array.length === 1) {
    renderCountry(array[0]);
}
};
const renderList = array => {
    const elements = array
    .map(({ name, flag }) => {
    return `<li class="country-list__item"><img src=${flag} alt="Flag of country" width="40">
    <h2 class="country-list__header">${name}</h2> </li>`;
    })
.join('');
refs.countryList.insertAdjacentHTML('beforeend', elements);
};
const renderCountry = ({ name, flag, population, languages, capital }) => {
const markup = `<p><h2><img src=${flag} alt="Flag of country" width="40"> ${name} </h2></p>
<p><span class="country-info__header">Capital:</span> ${capital}</p>
<p><span class="country-info__header">Population:</span> ${population}</p>
<p><span class="country-info__header">Languages:</span> ${languages[0].name}</p>`;
refs.countryInfo.insertAdjacentHTML('beforeend', markup);
};

function clinPage() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}


function onError() {
    clinPage();
    Notiflix.Notify.failure('Oops there is no country with that name');
}
