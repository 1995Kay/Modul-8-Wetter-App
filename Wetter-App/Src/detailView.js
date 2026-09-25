import { getFavoriteCities, getForcastWeather, saveCityFavorite } from "./api";
import { getConditionImagePath } from "./conditions";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import { loadMainMenu } from "./mainmenu";
import {
  formatHourlyTime,
  formatTemparature,
  formatToMilitaryTime,
  Get24HoursForcastFromNow,
  getDayOfWeek,
} from "./urils";

export async function loadDetailView(cityName) {
  renderLoadingScreen("Lade Wetter für " + cityName + "...");
  const weatherData = await getForcastWeather(cityName);
  rednerDetailView(weatherData, cityName);
  registerEventListeners(cityName);
}
function rednerDetailView(weatherData, city) {
  const { location, current, forecast } = weatherData;
  const currentDay = forecast.forecastday[0];
  const Astro = forecast.forecastday[0].astro;

  const conditionImage = getConditionImagePath(
    current.condition.code,
    current.is_day !== 1,
  );

  if (conditionImage) {
    rootElement.style = `--detail-condition-image:url(${conditionImage})`;
    rootElement.classList.add("show-background");
  }

  const isFavorite = getFavoriteCities().find((c) => c === city);

  rootElement.classList.add("show-background");

  rootElement.innerHTML =
    getActionBarHtml(!isFavorite) +
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
      forecast.forecastday,
      current.last_updated_epoch,
    ) +
    getForecastHtml(forecast.forecastday) +
    getMiniStatsHtml(
      current.humidity,
      current.feelslike_c,
      Astro.sunrise,
      Astro.sunset,
      current.precip_mm,
      current.uv,
    );
}

function getActionBarHtml(showFavoritesButton = true) {
  const backIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>`;

  const favoriteIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>`;

  return `
  <div class="action-bar">
  <div class="action-bar__back"> ${backIcon}</div>
  ${
    showFavoritesButton
      ? `<div class="action-bar__favorite">${favoriteIcon}</div>`
      : ""
  }
    </div>
  `;
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

function getTodayForecastHtml(
  condition,
  maxWind,
  forecastdays,
  lastUpdatedEpoch,
) {
  const hourlyForecastElements = Get24HoursForcastFromNow(
    forecastdays,
    lastUpdatedEpoch,
  )
    .filter((el) => el !== undefined)
    .map(
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

function getForecastHtml(forecast) {
  const forecastElements = forecast.map(
    (forecastDay, i) => `<div class="forecast-day">
              <div class="forecast-day__day">${i === 0 ? "Heute" : getDayOfWeek(forecastDay.date)}</div>
              <img
                src="https:${forecastDay.day.condition.icon}"
                alt=""
                class="forecast-day__icon" />
              <div class="forecast-day__max-tmep">${formatTemparature(forecastDay.day.maxtemp_c)}°</div>
              <div class="forecast-day__mintemp">${formatTemparature(forecastDay.day.mintemp_c)}°</div>
              <div class="forecast-day__wind">Wind ${formatTemparature(
                forecastDay.day.maxwind_kph,
              )}</div>
km/h
              </div>`,
  );

  const forecastHtml = forecastElements.join("");
  return `      <div class="forecast">
        <div class="forecast__titel">Vorhersage für die nächsten 3 Tag:</div>
        <div class="forecast__days">
        ${forecastHtml}
            </div>
          </div>
        </div>
      </div>`;
}

function getMiniStatsHtml(
  humidity,
  feelslike_c,
  sunrise,
  sunset,
  precip,
  uvIndex,
) {
  return `      <div class="mini-stats">
        <div class="mini-stat">
          <div class="mini-stat__heading">Feuchtigkeit</div>
          <div class="mini-stat__value">${humidity}%</div>
        </div>
          
        <div class="mini-stat">
          <div class="mini-stat__heading">Gefühlt</div>
          <div class="mini-stat__value">${feelslike_c}%</div>
        </div>
      
        <div class="mini-stat">
          <div class="mini-stat__heading">Sonnenaufgang</div>
          <div class="mini-stat__value">${formatToMilitaryTime(sunrise)} Uhr</div>
        </div>
      
        <div class="mini-stat">
          <div class="mini-stat__heading">Sonnenuntergang</div>
          <div class="mini-stat__value">${formatToMilitaryTime(sunset)} Uhr</div>
        </div>
      
        <div class="mini-stat">
          <div class="mini-stat__heading">Niederschlag</div>
          <div class="mini-stat__value">${precip}</div>
        </div>
     
        <div class="mini-stat">
          <div class="mini-stat__heading">UV-Index</div>
          <div class="mini-stat__value">${uvIndex}</div>
        </div>
      </div>`;
}

function registerEventListeners(city) {
  const backButton = document.querySelector(".action-bar__back");
  backButton.addEventListener("click", () => {
    loadMainMenu();
  });

  const favoriteButton = document.querySelector(".action-bar__favorite");

  favoriteButton?.addEventListener("click", () => {
    saveCityFavorite(city);
    favoriteButton.remove();
  });
}
