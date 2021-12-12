const BASE_URL = 'https://restcountries.com/v2';
export async function fetchCountry(name) {
  return fetch(`${BASE_URL}/name/${name}?fields=name,population,capital,languages,flag`)
};
export default { fetchCountry };


