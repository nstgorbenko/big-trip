import DayComponent from "./components/day.js";
import FilterComponent from "./components/filter.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import TripCostComponent from "./components/trip-cost.js";
import TripDaysComponent from "./components/trip-days.js";
import TripEventEditComponent from "./components/trip-event-edit.js";
import TripEventComponent from "./components/trip-event.js";
import TripInfoComponent from "./components/trip-info.js";
import {DESTINATION_ITEMS} from "./mock/destination.js";
import {eventToOffers} from "./mock/offers.js";
import {formatDateToDayDatetime} from "./utils/date/formatters.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";
import {RenderPosition} from "./const.js";

const EVENT_COUNT = 20;
const tripEvents = generateEvents(EVENT_COUNT).sort((a, b) => a.start - b.start);

const groupEventsByDays = (someEvents, date) => {
  return someEvents.reduce((days, currentDay) => {
    const someDate = formatDateToDayDatetime(currentDay[date]);

    if (!days.hasOwnProperty(someDate)) {
      days[someDate] = [];
    }
    days[someDate].push(currentDay);

    return days;
  }, {});
};

const renderTripEvent = (tripEventsContainer, tripEvent) => {
  const tripEventComponent = new TripEventComponent(tripEvent);
  const eventRollupButton = tripEventComponent.getElement().querySelector(`.event__rollup-btn`);
  const onEventRollupButtonClick = () => {
    tripEventsContainer.replaceChild(tripEventEditComponent.getElement(), tripEventComponent.getElement());
  };

  const tripEventEditComponent = new TripEventEditComponent(tripEvent, DESTINATION_ITEMS, eventToOffers);
  const eventEditForm = tripEventEditComponent.getElement();
  const onEventEditFormSubmit = () => {
    tripEventsContainer.replaceChild(tripEventComponent.getElement(), tripEventEditComponent.getElement());
  };

  eventRollupButton.addEventListener(`click`, onEventRollupButtonClick);
  eventEditForm.addEventListener(`submit`, onEventEditFormSubmit);
  render(tripEventsContainer, tripEventComponent.getElement());
};

const renderAllDays = (tripDaysContainer, allDays) => {
  const days = Object.keys(allDays).sort();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayIndex = i + 1;

    render(tripDaysContainer, new DayComponent(day, dayIndex).getElement());
    const tripEventsList = tripDaysContainer.querySelector(`.day:last-child`).querySelector(`.trip-events__list`);

    for (const tripEvent of allDays[day]) {
      renderTripEvent(tripEventsList, tripEvent);
    }
  }
};

const renderTripInfoBoard = () => {
  const tripMain = document.querySelector(`.trip-main`);
  render(tripMain, new TripInfoComponent(tripEvents).getElement(), RenderPosition.AFTERBEGIN);
  const tripInfo = tripMain.querySelector(`.trip-info`);
  render(tripInfo, new TripCostComponent(tripEvents).getElement());

  const tripControls = tripMain.querySelector(`.trip-controls`);
  const tripViewHeading = tripControls.querySelector(`h2`);
  render(tripViewHeading, new MenuComponent().getElement(), RenderPosition.AFTEREND);
  render(tripControls, new FilterComponent().getElement());
};

const renderTripEventsBoard = () => {
  const tripBoard = document.querySelector(`.trip-events`);
  render(tripBoard, new SortComponent().getElement());
  render(tripBoard, new TripDaysComponent().getElement());
  const tripDays = tripBoard.querySelector(`.trip-days`);

  const eventsDays = groupEventsByDays(tripEvents, `start`);
  renderAllDays(tripDays, eventsDays);
};

renderTripInfoBoard();
renderTripEventsBoard();
