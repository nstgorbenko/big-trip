import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import NewEventComponent from "./components/new-event.js";
import StatisticsController from "./controllers/statistics.js";
import TripController from "./controllers/trip.js";
import TripEventsModel from "./models/trip-events.js";
import TripInfoController from "./controllers/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";
import {MenuItem, RenderPosition} from "./const.js";

const EVENT_COUNT = 20;
const tripEvents = generateEvents(EVENT_COUNT);

const tripEventsModel = new TripEventsModel();
tripEventsModel.set(tripEvents);

const tripBoard = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const tripViewHeading = tripControls.querySelector(`h2`);

const menuComponent = new MenuComponent();
const newEventComponent = new NewEventComponent();
const statisticsController = new StatisticsController(tripBoard, tripEventsModel);
const tripInfoController = new TripInfoController(tripMain, tripEventsModel);
const filterController = new FilterController(tripControls, tripEventsModel);
const tripController = new TripController(tripBoard, tripEventsModel, newEventComponent);

tripInfoController.render();
render(tripViewHeading, menuComponent, RenderPosition.AFTEREND);
filterController.render();
render(tripMain, newEventComponent);
tripController.render();

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

const onNewEventClick = () => {
  newEventComponent.setDisabledState(true);
  filterController.setDefault();
  tripController.createEvent();
};

newEventComponent.setClickHandler(onNewEventClick);

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
