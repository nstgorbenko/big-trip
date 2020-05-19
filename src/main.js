import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import TripController from "./controllers/trip.js";
import TripEventsModel from "./models/trip-events.js";
import TripInfoController from "./controllers/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";
import {RenderPosition} from "./const.js";

const EVENT_COUNT = 20;
const tripEvents = generateEvents(EVENT_COUNT).sort((a, b) => a.start - b.start);

const tripEventsModel = new TripEventsModel();
tripEventsModel.setEvents(tripEvents);

const tripBoard = document.querySelector(`.trip-events`);
const tripController = new TripController(tripBoard, tripEventsModel);

const tripMain = document.querySelector(`.trip-main`);

const tripInfoController = new TripInfoController(tripMain, tripEventsModel);
tripInfoController.render();

const tripControls = tripMain.querySelector(`.trip-controls`);
const tripViewHeading = tripControls.querySelector(`h2`);
render(tripViewHeading, new MenuComponent(), RenderPosition.AFTEREND);

const filterController = new FilterController(tripControls, tripEventsModel);
filterController.render();

const addNewEvent = tripMain.querySelector(`.trip-main__event-add-btn`);
addNewEvent.addEventListener(`click`, () => {
  addNewEvent.disabled = true;
  filterController.setDefaultFilterType();
  tripController.createEvent();
});

tripController.render();
