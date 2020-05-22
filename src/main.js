import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip.js";
import TripEventsModel from "./models/trip-events.js";
import TripInfoController from "./controllers/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";
import {MenuItem, RenderPosition} from "./const.js";

const EVENT_COUNT = 20;
const tripEvents = generateEvents(EVENT_COUNT);

const pageBodyContainers = document.querySelectorAll(`.page-body__container`);

const tripEventsModel = new TripEventsModel();
tripEventsModel.set(tripEvents);

const tripBoard = document.querySelector(`.trip-events`);
const tripController = new TripController(tripBoard, tripEventsModel);

const tripMain = document.querySelector(`.trip-main`);

const tripInfoController = new TripInfoController(tripMain, tripEventsModel);
tripInfoController.render();

const tripControls = tripMain.querySelector(`.trip-controls`);
const tripViewHeading = tripControls.querySelector(`h2`);
const menuComponent = new MenuComponent();
render(tripViewHeading, menuComponent, RenderPosition.AFTEREND);

const filterController = new FilterController(tripControls, tripEventsModel);
filterController.render();

const statisticsComponent = new StatisticsComponent(tripEventsModel);
render(tripBoard, statisticsComponent, RenderPosition.AFTEREND);
statisticsComponent.hide();

const showTable = () => {
  statisticsComponent.hide();
  tripController.show();
  pageBodyContainers.forEach((bodyContainer) => bodyContainer.classList.remove(`page-body__container--stats`));
};

const showStats = () => {
  filterController.setDefault();
  tripController.hide();
  statisticsComponent.show();
  pageBodyContainers.forEach((bodyContainer) => bodyContainer.classList.add(`page-body__container--stats`));
};

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      showTable();
      break;
    case MenuItem.STATS:
      showStats();
      break;
  }
});

const newEvent = tripMain.querySelector(`.trip-main__event-add-btn`);
newEvent.addEventListener(`click`, () => {
  showTable();
  newEvent.disabled = true;
  menuComponent.setDefault();
  filterController.setDefault();
  tripController.createEvent();
});

tripController.render();
