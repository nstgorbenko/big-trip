import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import TripEventComponent from "../components/trip-event.js";
import TripMessageComponent from "../components/trip-message.js";
import {destinations} from "../mock/destination.js";
import {eventToOffers} from "../mock/offers.js";
import {formatDateToDayDatetime} from "../utils/date/formatters.js";
import {getSortedTripEvents, SortType} from "../utils/sort.js";
import {isEscKey} from "../utils/common.js";
import {Message} from "../const.js";
import {render, replace} from "../utils/dom.js";

const groupEventsByDays = (someEvents) => {
  return someEvents.reduce((days, currentDay) => {
    const someDate = formatDateToDayDatetime(currentDay.start);

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

const renderGroupedEvents = (tripEventsContainer, groupedEvents) => {
  const days = Object.keys(groupedEvents);

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayCounter = i + 1;
    const dayComponent = new DayComponent(day, dayCounter);
    const eventsListComponent = new EventsListComponent();

    for (const tripEvent of groupedEvents[day]) {
      renderTripEvent(eventsListComponent.getElement(), tripEvent);
    }

    render(dayComponent.getElement(), eventsListComponent);
    render(tripEventsContainer, dayComponent);
  }
};

const renderAllEvents = (tripEventsContainer, allEvents) => {
  const eventsByDays = groupEventsByDays(allEvents);
  renderGroupedEvents(tripEventsContainer, eventsByDays);
};

const renderSortedTripEvents = (sortType, tripDays, tripEvents) => {
  const sortedTripEvents = getSortedTripEvents(tripEvents, sortType);

  if (sortType === SortType.DEFAULT) {
    renderAllEvents(tripDays, sortedTripEvents);
  } else {
    const dayComponent = new DayComponent();
    const eventsListComponent = new EventsListComponent();

    renderTripEvents(eventsListComponent.getElement(), sortedTripEvents);
    render(dayComponent.getElement(), eventsListComponent);
    render(tripDays, dayComponent);
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(tripEvents) {
    const container = this._container;

    if (tripEvents.length === 0) {
      render(container, new TripMessageComponent(Message.NO_EVENTS));
      return;
    }

    const sortComponent = new SortComponent();
    const tripDaysComponent = new TripDaysComponent();

    render(container, sortComponent);
    render(container, tripDaysComponent);

    const tripDays = tripDaysComponent.getElement();
    renderAllEvents(tripDays, tripEvents);

    sortComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysComponent.clear();
      renderSortedTripEvents(sortType, tripDays, tripEvents);
    });
  }
}
