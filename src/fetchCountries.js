const BASE_URL = 'https://restcountries.com/v2';
function fetchCountry(name) {
  return fetch(`${BASE_URL}/name/${name}?fields=name,population,capital,languages,flag`)
    .then(response => {
            if (!response.ok) {
            throw new Error(response.status);
            }
            return response.json();
        })
};
export default { fetchCountry };


