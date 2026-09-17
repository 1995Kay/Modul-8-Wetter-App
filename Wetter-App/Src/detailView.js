import { getForcastWeather } from "./api";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import { formatTemparature } from "./urils";

export async function loadDetailView(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + "...");
  const weatherData = await getForcastWeather(cityName);
  rednerDetailView(weatherData);
  function rednerDetailView(weatherData) {
    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];
    rootElement.innerHTML = getHeaderHtml(
      location.name,
      formatTemparature(current.temp_c),
      current.condition.text,
      formatTemparature(currentDay.day.maxtemp_c),
      formatTemparature(currentDay.day.mintemp_c),
    );
  }
}

function getHeaderHtml(location, currentTemp, condition, maxTemp, minTemp) {
  return `<div class="current-weather">
        <h2 class="current-weather__location">${location}</h2>
        <h1 class="current-weather__current-temperature">${currentTemp}</h1>
        <p class="current-weather__condition">${condition}</p>
        <div class="current-weather__day-temperature">
          <span class="current-weather__max-temperature">H:${maxTemp}</span>
          <span class="current-weather__min-temperature">T:${minTemp}</span>
          </div>
        </div>
    `;
}
