import { getConditionImagePath } from "./conditions";
import { loadDetailView } from "./detailView";
import { renderLoadingScreen } from "./loading";
import { rootElement } from "./main";
import {
  getFavoriteCities,
  getForcastWeather,
  removeCityFromFavorites,
} from "./api";
import { formatTemparature } from "./urils";

export async function loadMainMenu() {
  rootElement.classList.remove("show-background");
  renderLoadingScreen("Lade Übersicht");
  await renderMainMenu();
}

export async function renderMainMenu() {
  rootElement.innerHTML = `<div class="main-menu">
  ${getMenuHeaderHtml()}
  ${await getCityListHtml()}
    </div>`;

  registerEventListeners();
}

function getMenuHeaderHtml() {
  return `<div class="main-menu__heading">
          Wetter <button class="main-menu__edit">bearbeiten</button>
        </div>
        <div class="main-menu__search-bar">
          <input
            type="text"
            class="main-menu__search-input"
            placeholder="Nach Stadt suchen"
          />
        </div>`;
}

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
`;

async function getCityListHtml() {
  const favoriteCities = getFavoriteCities();

  if (!favoriteCities || favoriteCities.length < 1) {
    return "Noch keine Favoriten gespeichert";
  }

  const favoriteCitiesElements = await Promise.all(
    favoriteCities.map(async (city) => {
      try {
        const weatherData = await getForcastWeather(city, 1);
        const { location, current, forecast } = weatherData;
        const currentDay = forecast.forecastday[0];

        const conditionImage = getConditionImagePath(
          current.condition.code,
          current.is_day !== 1,
        );

        return `  <div class="city-wrapper">

       <div class="city-wrapper__delete" data-city-id="${city}">${deleteIcon}</div>
          <div class="city" data-city-name="${city}" style="--condition-image: url(${conditionImage})">
            <div class="city__left-column">
              <h2 class="city__name">${location.name}</h2>
              <div class="city__country">${location.country}</div>
              <div class="city__condition">${current.condition.text}</div>
            </div>
            <div class="city__right-column">
              <div class="city__temperature">${formatTemparature(current.temp_c)}</div>
              <div class="city__min-max-temperature">${formatTemparature(currentDay.day.maxtemp_c)}H ${formatTemparature(currentDay.day.mintemp_c)}T</div>
            </div>
          </div>
        </div>`;
      } catch (error) {
        console.error(`Fehler beim Laden der Daten für ${city}:`, error);
        return `<div class="city-wrapper"><div class="city city--error">Wetterdaten für ${city} nicht verfügbar</div></div>`;
      }
    }),
  );

  const favoriteCitiesHtml = favoriteCitiesElements.join("");

  return `
  <div class="main-menu__cities-list"> 
    ${favoriteCitiesHtml} 
  </div>`;
}
function registerEventListeners() {
  const editButton = document.querySelector(".main-menu__edit");
  const EDIT_ATTRIBUTE = "data-edit-mode";
  const deleteButtons = document.querySelectorAll(".city-wrapper__delete");
  const cities = document.querySelectorAll(".city");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cityId = btn.getAttribute("data-city-id");
      removeCityFromFavorites(cityId);
      btn.parentElement.remove();
    });
  });

  editButton.addEventListener("click", () => {
    if (!editButton.getAttribute(EDIT_ATTRIBUTE)) {
      editButton.setAttribute(EDIT_ATTRIBUTE, "true");
      editButton.textContent = "Fertig";

      deleteButtons.forEach((btn) => {
        btn.classList.add("city-wrapper__delete--show");
      });
    } else {
      editButton.removeAttribute(EDIT_ATTRIBUTE);
      editButton.textContent = "Bearbeiten";

      deleteButtons.forEach((btn) => {
        btn.classList.remove("city-wrapper__delete--show");
      });
    }
  });

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");
      loadDetailView(cityName);
    });
  });
}
