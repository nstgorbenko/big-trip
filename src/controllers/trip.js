import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventController from "./trip-event.js";
import TripMessageComponent from "../components/trip-message.js";
import {formatDateToDayDatetime} from "../utils/date/formatters.js";
import {getSortedTripEvents, SortType} from "../utils/sort.js";
import {ActionType, Message} from "../const.js";
import {render} from "../utils/dom.js";

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

const renderTripEvents = (tripEventsContainer, tripEvents, dispatch) => {
  return tripEvents.map((tripEvent) => {
    const tripEventController = new TripEventController(tripEventsContainer, dispatch);
    tripEventController.render(tripEvent);

    return tripEventController;
  });
};

const renderGroupedEvents = (tripDaysContainer, groupedEvents, dispatch) => {
  const days = Object.keys(groupedEvents);
  const eventControllers = [];

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayCounter = i + 1;
    const dayComponent = new DayComponent(day, dayCounter);
    const eventsListComponent = new EventsListComponent();

    for (const tripEvent of groupedEvents[day]) {
      const tripEventController = new TripEventController(eventsListComponent.getElement(), dispatch);
      tripEventController.render(tripEvent);
      eventControllers.push(tripEventController);
    }

    render(dayComponent.getElement(), eventsListComponent);
    render(tripDaysContainer, dayComponent);
  }

  return eventControllers;
};

const renderAllEvents = (tripEventsContainer, allEvents, dispatch) => {
  const eventsByDays = groupEventsByDays(allEvents);
  return renderGroupedEvents(tripEventsContainer, eventsByDays, dispatch);
};

const renderSortedTripEvents = (sortType, tripDays, tripEvents, dispatch) => {
  const sortedTripEvents = getSortedTripEvents(tripEvents, sortType);

  if (sortType === SortType.DEFAULT) {
    return renderAllEvents(tripDays, sortedTripEvents, dispatch);
  }

  const dayComponent = new DayComponent();
  const eventsListComponent = new EventsListComponent();

  render(tripDays, dayComponent);
  render(dayComponent.getElement(), eventsListComponent);

  return renderTripEvents(eventsListComponent.getElement(), getSortedTripEvents(tripEvents, sortType), dispatch);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._tripEvents = [];
    this._showedTripEvents = [];
    this._tripDaysComponent = null;

    this._dispatch = this._dispatch.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  render(tripEvents) {
    const container = this._container;
    this._tripEvents = tripEvents;

    if (tripEvents.length === 0) {
      render(container, new TripMessageComponent(Message.NO_EVENTS));
      return;
    }

    this._tripDaysComponent = new TripDaysComponent();

    const sortComponent = new SortComponent();
    sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    render(container, sortComponent);
    render(container, this._tripDaysComponent);

    const tripDays = this._tripDaysComponent.getElement();
    this._showedTripEvents = renderAllEvents(tripDays, tripEvents, this._dispatch);
  }

  _setDefaultViews() {
    this._showedTripEvents.forEach((tripEvent) => tripEvent.setDefaultView());
  }

  _dispatch(action) {
    switch (action.type) {
      case ActionType.TO_EDIT:
        this._setDefaultViews();
        break;
      case ActionType.TO_VIEW:
        break;
      case ActionType.ADD_TO_FAVORITE:
        const newTripEvent = this._tripEvents.find(({id}) => id === action.payload.id);
        if (newTripEvent) {
          newTripEvent.isFavorite = !newTripEvent.isFavorite;
          action.payload.tripEventController.render(newTripEvent);
        }
    }
  }

  _onSortTypeChange(sortType) {
    const tripDays = this._tripDaysComponent.getElement();
    this._tripDaysComponent.clear();
    this._showedTripEvents = renderSortedTripEvents(sortType, tripDays, this._tripEvents, this._dispatch);
  }
}
