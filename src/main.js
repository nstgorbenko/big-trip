import API from "./api/api.js";
import DestinationsModel from "./models/destinations.js";
import FilterController from "./controllers/filter-controller.js";
import MenuComponent from "./components/menu.js";
import NewEventComponent from "./components/new-event.js";
import OffersModel from "./models/offers.js";
import Provider from "./api/provider.js";
import StatisticsController from "./controllers/statistics-controller.js";
import Store from "./api/store.js";
import TripController from "./controllers/trip-controller.js";
import TripEventsModel from "./models/trip-events.js";
import TripInfoController from "./controllers/trip-info-controller.js";
import {render} from "./utils/dom.js";
import {MenuItem, RenderPosition} from "./const.js";

const AUTHORIZATION = `Basic jzkskbfjkse6761gisnfkj=`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripBoard = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripViewHeading = tripControls.querySelector(`h2`);

const tripEventsModel = new TripEventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store, tripEventsModel);

const menuComponent = new MenuComponent();
const newEventComponent = new NewEventComponent();

const statisticsController = new StatisticsController(tripBoard, tripEventsModel);
const tripInfoController = new TripInfoController(tripMain, tripEventsModel);
const filterController = new FilterController(tripControls, tripEventsModel);
const tripController = new TripController(tripBoard, tripEventsModel, destinationsModel, offersModel, apiWithProvider, newEventComponent);

const showTable = () => {
  statisticsController.hide();
  newEventComponent.show();
  filterController.show();
  tripController.show();
};

const showStats = () => {
  statisticsController.show();
  newEventComponent.hide();
  filterController.hide();
  tripController.hide();
};

const newEventClickHandler = () => {
  newEventComponent.setDisabled(true);
  tripController.createEvent();
  filterController.setDefault();
};

const blockUI = () => {
  tripController.showErrorMessage();
  newEventComponent.hide();
  menuComponent.hide();
};

render(tripMain, newEventComponent);
render(tripViewHeading, menuComponent, RenderPosition.AFTEREND);

newEventComponent.setClickHandler(newEventClickHandler);
menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      showTable();
      break;
    case MenuItem.STATS:
      showStats();
      break;
  }
});

tripController.showLoadingMessage();
apiWithProvider.getAllData()
  .then((tripData) => {
    tripEventsModel.set(tripData.tripEvents);
    destinationsModel.set(tripData.destinations);
    offersModel.set(tripData.offers);

    tripInfoController.render();
    filterController.render();
    tripController.render();
  })
  .catch((error) => {
    blockUI();
    throw error;
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.isOutdated()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
