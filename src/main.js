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
    const tripEventsListElement = tripDaysContainer.querySelector(`.day:last-child`).querySelector(`.trip-events__list`);

    for (const tripEvent of allDays[day]) {
      renderTripEvent(tripEventsListElement, tripEvent);
    }
  }
};

const renderTripInfoBoard = () => {
  const tripMainElement = document.querySelector(`.trip-main`);
  render(tripMainElement, new TripInfoComponent(tripEvents).getElement(), RenderPosition.AFTERBEGIN);
  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
  render(tripInfoElement, new TripCostComponent(tripEvents).getElement());

  const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
  const tripViewHeadingElement = tripControlsElement.querySelector(`h2`);
  render(tripViewHeadingElement, new MenuComponent().getElement(), RenderPosition.AFTEREND);
  render(tripControlsElement, new FilterComponent().getElement());
};

const renderTripEventsBoard = () => {
  const tripEventsElement = document.querySelector(`.trip-events`);
  render(tripEventsElement, new SortComponent().getElement());
  render(tripEventsElement, new TripDaysComponent().getElement());
  const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

  const eventsDays = groupEventsByDays(tripEvents, `start`);
  renderAllDays(tripDaysElement, eventsDays);
};

renderTripInfoBoard();
renderTripEventsBoard();
