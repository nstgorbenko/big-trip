import API from "./api.js";
import DestinationsModel from "./models/destinations.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import NewEventComponent from "./components/new-event.js";
import OffersModel from "./models/offers.js";
import StatisticsController from "./controllers/statistics.js";
import TripController from "./controllers/trip.js";
import TripEventsModel from "./models/trip-events.js";
import TripInfoController from "./controllers/trip-info.js";
import {render} from "./utils/dom.js";
import {MenuItem, RenderPosition} from "./const.js";

const tripBoard = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripViewHeading = tripControls.querySelector(`h2`);

const bigTripApi = new API();

const tripEventsModel = new TripEventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const menuComponent = new MenuComponent();
const newEventComponent = new NewEventComponent();

const statisticsController = new StatisticsController(tripBoard, tripEventsModel);
const tripInfoController = new TripInfoController(tripMain, tripEventsModel);
const filterController = new FilterController(tripControls, tripEventsModel);
const tripController = new TripController(tripBoard, tripEventsModel, destinationsModel, offersModel, bigTripApi, newEventComponent);

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

render(tripMain, newEventComponent);
render(tripViewHeading, menuComponent, RenderPosition.AFTEREND);

tripController.showLoadingMessage();
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

bigTripApi.getAllData()
  .then((tripData) => {
    tripEventsModel.set(tripData.tripEvents);
    destinationsModel.set(tripData.destinations);
    offersModel.set(tripData.offers);
  })
  .then(() => {
    tripInfoController.render();
    filterController.render();
    tripController.render();
  })
  .catch((error) => {
    throw error;
  });
