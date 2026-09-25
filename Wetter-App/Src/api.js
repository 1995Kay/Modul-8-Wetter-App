const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "48bda90f4974409d91990356261609";
const FAVORITE_CITIES_KEY = "favorite-cities";

export async function getForcastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=3`,
  );

  const weatherData = await response.json();
  console.log(weatherData);

  return weatherData;
}

export function getFavoriteCities() {
  return JSON.parse(localStorage.getItem(FAVORITE_CITIES_KEY)) || [];
}

export function saveCityFavorite(city) {
  const favorites = getFavoriteCities();

  if (favorites.find((favorite) => favorite === city)) {
    alert(city + "wurde bereits den Favoriten hinzugefügt!");
    return;
  }

  favorites.push(city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
}

export function removeCityFromFavorites(city) {
  const favorites = getFavoriteCities();

  const filteredFavorites = favorites.filter((favorite) => favorite !== city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(filteredFavorites));
}
