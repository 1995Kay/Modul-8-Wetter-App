const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "48bda90f4974409d91990356261609";

export async function getForcastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&day`,
  );

  const weatherData = await response.json();
  console.log(weatherData);

  return weatherData;
}
