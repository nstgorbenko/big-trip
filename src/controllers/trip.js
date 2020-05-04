import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import SortComponent, {SortType} from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import TripEventComponent from "../components/trip-event.js";
import TripMessageComponent from "../components/trip-message.js";
import {destinations} from "../mock/destination.js";
import {eventToOffers} from "../mock/offers.js";
import {formatDateToDayDatetime} from "../utils/date/formatters.js";
import {getOffersCost} from "../components/trip-cost.js";
import {isEscKey} from "../utils/common.js";
import {Message} from "../const.js";
import {render, replace} from "../utils/dom.js";

const groupEventsByDays = (someEvents) => {
  return someEvents.reduce((days, currentDay) => {
    const someDate = formatDateToDayDatetime(currentDay[`start`]);

    if (!days.hasOwnProperty(someDate)) {
      days[someDate] = [];
    }
    days[someDate].push(currentDay);

    return days;
  }, {});
};

const renderTripEvent = (tripEventsContainer, tripEvent) => {
  const replaceEventToEdit = () => replace(tripEventEditComponent, tripEventComponent);
  const replaceEditToEvent = () => replace(tripEventComponent, tripEventEditComponent);
  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventEditComponent = new TripEventEditComponent(tripEvent, destinations, eventToOffers);

  tripEventComponent.setRollupButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventEditComponent.setSubmitHandler(() => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripEventsContainer, tripEventComponent);
};

const renderTripEvents = (tripEventsContainer, tripEvents) => {
  tripEvents.forEach((tripEvent) =>
    renderTripEvent(tripEventsContainer, tripEvent));
};

const renderAllDays = (tripDaysContainer, allDays) => {
  const days = Object.keys(allDays).sort();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayCounter = i + 1;
    const dayComponent = new DayComponent(day, dayCounter);
    const eventsListComponent = new EventsListComponent();

    for (const tripEvent of allDays[day]) {
      renderTripEvent(eventsListComponent.getElement(), tripEvent);
    }

    render(dayComponent.getElement(), eventsListComponent);
    render(tripDaysContainer, dayComponent);
  }
};

const sortEventsByTime = (firstEvent, secondEvent) => {
  const firstEventDuration = firstEvent.end - firstEvent.start;
  const secondEventDuration = secondEvent.end - secondEvent.start;

  return secondEventDuration - firstEventDuration;
};

const sortEventsByPrice = (firstEvent, secondEvent) => {
  const firstEventPrice = firstEvent.offers.length > 0 ? getOffersCost(firstEvent.offers, firstEvent.basePrice) : firstEvent.basePrice;
  const secondEventPrice = secondEvent.offers.length > 0 ? getOffersCost(secondEvent.offers, secondEvent.basePrice) : secondEvent.basePrice;

  return secondEventPrice - firstEventPrice;
};

const getSortedTripEvents = (tripEvents, sortType) => {
  let sortedTripEvents = [];
  const showingEvents = tripEvents.slice();

  switch (sortType) {
    case SortType.TIME:
      sortedTripEvents = showingEvents.sort(sortEventsByTime);
      break;
    case SortType.PRICE:
      sortedTripEvents = showingEvents.sort(sortEventsByPrice);
      break;
    case SortType.DEFAULT:
      sortedTripEvents = showingEvents;
      break;
  }

  return sortedTripEvents;
};

const renderSortedTripEvents = (sortType, tripDays, tripEvents) => {
  if (sortType === SortType.DEFAULT) {
    const eventsDays = groupEventsByDays(tripEvents);
    renderAllDays(tripDays, eventsDays);
  } else {
    const dayComponent = new DayComponent();
    const eventsListComponent = new EventsListComponent();

    renderTripEvents(eventsListComponent.getElement(), getSortedTripEvents(tripEvents, sortType));
    render(dayComponent.getElement(), eventsListComponent);
    render(tripDays, dayComponent);
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(tripEvents) {
    if (tripEvents.length === 0) {
      render(this._container, new TripMessageComponent(Message.NO_EVENTS));
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._tripDaysComponent);

    const tripDays = this._tripDaysComponent.getElement();
    const eventsDays = groupEventsByDays(tripEvents);
    renderAllDays(tripDays, eventsDays);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      tripDays.innerHTML = ``;
      renderSortedTripEvents(sortType, tripDays, tripEvents);
    });
  }
}
