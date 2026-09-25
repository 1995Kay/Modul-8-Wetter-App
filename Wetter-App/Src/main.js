import { loadDetailView } from "./detailView.js";
import { renderMainMenu } from "./mainmenu";
import { loadMainMenu } from "./mainmenu";
import "../Styles/styles.scss";

export const rootElement = document.getElementById("app");

loadDetailView("Neuhof");
renderMainMenu();
loadMainMenu();
