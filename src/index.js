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

refs.searchForm.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();
    clinPage();
    let searchCountry = e.target.value.trim();
    if (!searchCountry) {
        Notiflix.Notify.info('Type country name.');
        return;
    }
    API.fetchCountry(searchCountry)
        .then((countries) => {
            console.log(countries)
            if (countries.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.'); 
            }
            if (countries.length > 1 && countries.length <= 10) {
                renderList(countries);
            }
             else if (countries.length === 1) {
                renderCountry(countries[0]);
            }
        })
        .catch(onError);
};

function renderList(countries) {
    const elements = countries.map(country => {
    return `<li class="country-list__item"><img src=${country.flags.svg} alt="Flag of country" width="40">
    <h2 class="country-list__header">${country.name.common}</h2> </li>`;
    }).join('');
    refs.countryList.insertAdjacentHTML('afterbegin', elements);
};

function renderCountry(country) {
    const lang = Object.values(country.languages);
    const markup = ` <div class="country-list__item"><img src=${country.flags.svg} alt="Flag of country" width="40"><h2 class="country-list__header">${country.name.common} </h2></div>
<p><span class="country-info__header">Capital:</span> ${country.capital}</p>
<p><span class="country-info__header">Population:</span> ${country.population}</p>

<p><span class="country-info__header">Languages:</span> ${lang}</p>`;

refs.countryInfo.insertAdjacentHTML('afterbegin', markup);
};

function clinPage() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}

function onError() {
    clinPage();
    Notiflix.Notify.failure('Oops, there is no country with that name');
}
