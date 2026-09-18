import { getForcastWeather } from "./api";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import { formatHourlyTime, formatTemparature } from "./urils";

export async function loadDetailView(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + "...");
  const weatherData = await getForcastWeather(cityName);
  rednerDetailView(weatherData);
  function rednerDetailView(weatherData) {
    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];
    rootElement.innerHTML =
      getHeaderHtml(
        location.name,
        formatTemparature(current.temp_c),
        current.condition.text,
        formatTemparature(currentDay.day.maxtemp_c),
        formatTemparature(currentDay.day.mintemp_c),
      ) +
      getTodayForecastHtml(
        currentDay.day.condition.text,
        currentDay.day.maxwind_kph,
        currentDay.hour,
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

function getTodayForecastHtml(condition, maxWind, forecastHours) {
  const hourlyForecastElements = forecastHours.map(
    (hour, i) => `  <div class="hourly-forecast">
            <div class="hourly-forecast__time">${i === 0 ? "Jetzt" : formatHourlyTime(hour.time) + " Uhr"} </div>
            <img
              src="https:${hour.condition.icon}"
              alt=""
              class="hourly-forecast__icon"
            />
            <div class="hourly-forecast__temperature">${formatTemparature(hour.temp_c)}°</div>
          </div>`,
  );
  const hourlyForecastHtml = hourlyForecastElements.join("");
  return `  <div class="today-forecast">
        <div class="today-forecast__conditions">
          Heute ${condition} wind bis zu ${maxWind} km/h.
        </div>
        <div class="today-forecast__hours">
${hourlyForecastHtml}
        </div>
      </div>`;
}
