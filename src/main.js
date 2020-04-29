import FilterComponent from "./components/filter.js";
import MenuComponent from "./components/menu.js";
import TripController from "./controllers/trip.js";
import TripCostComponent from "./components/trip-cost.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";
import {RenderPosition} from "./const.js";

const EVENT_COUNT = 20;

const tripBoard = document.querySelector(`.trip-events`);
const tripController = new TripController(tripBoard);

const renderTripInfoBoard = () => {
  const tripMain = document.querySelector(`.trip-main`);
  render(tripMain, new TripInfoComponent(tripEvents), RenderPosition.AFTERBEGIN);
  const tripInfo = tripMain.querySelector(`.trip-info`);
  render(tripInfo, new TripCostComponent(tripEvents));

  const tripControls = tripMain.querySelector(`.trip-controls`);
  const tripViewHeading = tripControls.querySelector(`h2`);
  render(tripViewHeading, new MenuComponent(), RenderPosition.AFTEREND);
  render(tripControls, new FilterComponent());
};

const tripEvents = generateEvents(EVENT_COUNT).sort((a, b) => a.start - b.start);
renderTripInfoBoard();
tripController.render(tripEvents);
