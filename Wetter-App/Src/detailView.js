import { getForcastWeather } from "./api";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import {
  formatHourlyTime,
  formatTemparature,
  Get24HoursForcastFromNow,
} from "./urils";

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
        forecast.forecastday,
        current.last_updated_epoch,
      ) +
      getForecastHtml(forecast.forecastday);
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
    (forecastDay) => `<div class="forecast-day">
              <div class="forecast-day__day">Heute</div>
              <img
                src="https://cdn.weatherapi.com/weather/64x64/day/176.png"
                alt=""
                class="forecast-day__icon" />
              <div class="forecast-day__max-tmep">${formatTemparature(forecastDay.day.maxtemp_c)}°</div>
              <div class="forecast-day__mintemp">${formatTemparature(forecastDay.day.mintemp_c)}°</div>
              <div class="forecast-day__wind">${formatTemparature(
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
