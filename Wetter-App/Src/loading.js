import { rootElement } from "./main";

export function renderLoadingScreen(message = "laden...") {
  rootElement.innerHTML = getLoadingHTML(message);
}

function getLoadingHTML(message) {
  return `      <div class="loading">
        <div class="loading__massage">${message}</div>
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>`;
}
