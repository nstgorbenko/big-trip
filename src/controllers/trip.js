import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventController from "./trip-event.js";
import TripMessageComponent from "../components/trip-message.js";
import {formatDateToDayDatetime} from "../utils/date/formatters.js";
import {getSortedTripEvents} from "../utils/sort.js";
import {ActionType, EmptyEvent, Message, Mode, SortType} from "../const.js";
import {remove, render} from "../utils/dom.js";

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

const renderTripEvents = (container, tripEvents, dispatch) => {
  return tripEvents.map((tripEvent) => {
    const tripEventController = new TripEventController(container, dispatch);
    tripEventController.render(tripEvent);

    return tripEventController;
  });
};

const renderGroupedEvents = (container, groupedEvents, dispatch) => {
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
    render(container, dayComponent);
  }

  return eventControllers;
};

const renderAllEvents = (container, allEvents, dispatch) => {
  const eventsByDays = groupEventsByDays(allEvents);
  return renderGroupedEvents(container, eventsByDays, dispatch);
};

const renderSortedTripEvents = (sortType, container, tripEvents, dispatch) => {
  const sortedTripEvents = getSortedTripEvents(tripEvents, sortType);

  if (sortType === SortType.DEFAULT) {
    return renderAllEvents(container, sortedTripEvents, dispatch);
  }

  const dayComponent = new DayComponent();
  const eventsListComponent = new EventsListComponent();

  render(container, dayComponent);
  render(dayComponent.getElement(), eventsListComponent);

  return renderTripEvents(eventsListComponent.getElement(), getSortedTripEvents(tripEvents, sortType), dispatch);
};

export default class TripController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._showedTripEvents = [];
    this._newEvent = null;

    this._tripDaysComponent = new TripDaysComponent();
    this._tripMessageComponent = null;
    this._sortComponent = null;

    this._dispatch = this._dispatch.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripEventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const tripEvents = this._tripEventsModel.getAll();

    if (this._tripEventsModel.isEmpty()) {
      this._renderTripMessage(Message.NO_EVENTS);
      return;
    }

    this._renderFirstBoard(tripEvents);
  }

  createEvent() {
    if (this._newEvent !== null) {
      return;
    }

    if (this._tripEventsModel.isEmpty()) {
      remove(this._tripMessageComponent);
      this._renderNewEvent(this._container, Mode.FIRST);
    } else {
      this._setDefaultViews();
      this._renderNewEvent(this._tripDaysComponent.getElement(), Mode.ADD);
    }
  }

  _renderFirstBoard(tripEvents) {
    this._sortComponent = new SortComponent();
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    render(this._container, this._sortComponent);
    render(this._container, this._tripDaysComponent);

    const tripDays = this._tripDaysComponent.getElement();
    this._showedTripEvents = renderSortedTripEvents(SortType.DEFAULT, tripDays, tripEvents, this._dispatch);
  }

  _renderNewEvent(container, mode) {
    this._newEvent = new TripEventController(container, this._dispatch);
    this._newEvent.render(EmptyEvent, mode);
  }

  _renderTripMessage(message) {
    this._tripMessageComponent = new TripMessageComponent(message);
    render(this._container, this._tripMessageComponent);
  }

  _removeFirstBoard() {
    this._removeEvents();
    remove(this._sortComponent);
    remove(this._tripDaysComponent);
    this._renderTripMessage(Message.NO_EVENTS);
  }

  _removeNewEvent() {
    this._newEvent.destroy();
    this._newEvent = null;
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  _removeEvents() {
    this._showedTripEvents.forEach((tripEvent) => tripEvent.destroy());
    this._showedTripEvents = [];
  }

  _setDefaultViews() {
    this._showedTripEvents.forEach((tripEvent) => tripEvent.setDefaultView());
  }

  _updateEvents(sortType) {
    const tripDays = this._tripDaysComponent.getElement();
    const tripEvents = this._tripEventsModel.get();
    const newSortType = sortType || this._sortComponent.getActiveType();

    this._removeEvents();
    this._tripDaysComponent.clear();
    this._showedTripEvents = renderSortedTripEvents(newSortType, tripDays, tripEvents, this._dispatch);
  }

  _handleAddToFavoriteAction({payload}) {
    this._tripEventsModel.update(payload.id, payload.newData);
    payload.controller.render(payload.newData, Mode.EDIT);
  }

  _handleDeleteAction({payload}) {
    this._tripEventsModel.deleteEvent(payload.id);

    if (this._tripEventsModel.isEmpty()) {
      this._removeFirstBoard();
      return;
    }
    this._updateEvents();
  }

  _handleRemoveNewEventAction() {
    this._removeNewEvent();

    if (this._tripEventsModel.isEmpty()) {
      this._renderTripMessage(Message.NO_EVENTS);
    }
  }

  _handleToEditAction() {
    this._setDefaultViews();
    if (this._newEvent) {
      this._removeNewEvent();
    }
  }

  _handleUpdateAction({payload}) {
    if (payload.id) {
      this._tripEventsModel.update(payload.id, payload.newData);
      this._updateEvents();
      return;
    }

    this._tripEventsModel.add(payload.newData);
    this._removeNewEvent();

    const tripEvents = this._tripEventsModel.getAll();
    if (tripEvents.length === 1) {
      this._renderFirstBoard(tripEvents);
    } else {
      this._updateEvents();
    }
  }

  _dispatch(action) {
    switch (action.type) {
      case ActionType.ADD_TO_FAVORITE:
        this._handleAddToFavoriteAction(action);
        break;
      case ActionType.DELETE:
        this._handleDeleteAction(action);
        break;
      case ActionType.REMOVE_NEW_EVENT:
        this._handleRemoveNewEventAction();
        break;
      case ActionType.TO_EDIT:
        this._handleToEditAction();
        break;
      case ActionType.UPDATE:
        this._handleUpdateAction(action);
        break;
    }
  }

  _onFilterChange() {
    this._sortComponent.setDefault();
    this._updateEvents();
  }

  _onSortTypeChange(sortType) {
    this._updateEvents(sortType);
  }
}
