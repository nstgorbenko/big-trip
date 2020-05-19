import {FilterType} from "../const.js";
import {getEventsByFilter} from "../utils/common.js";

export default class TripEvents {
  constructor() {
    this._tripEvents = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getAllEvents() {
    return this._tripEvents;
  }

  getEvents() {
    return getEventsByFilter(this._tripEvents, this._activeFilterType);
  }

  setEvents(tripEvents) {
    this._tripEvents = Array.from(tripEvents);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  addTripEvent(newEvent) {
    const newTripEvent = Object.assign({}, newEvent, {
      id: String(new Date() + Math.random())
    });
    this._tripEvents.push(newTripEvent);
    this._tripEvents.sort((a, b) => a.start - b.start);
    this._callHandlers(this._dataChangeHandlers);
  }

  deleteTripEvent(id) {
    const index = this._tripEvents.findIndex((tripEvent) => tripEvent.id === id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), this._tripEvents.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateTripEvent(id, updatedEvent) {
    const index = this._tripEvents.findIndex((tripEvent) => tripEvent.id === id);

    if (index === -1) {
      return false;
    }

    this._tripEvents[index] = updatedEvent;
    this._tripEvents.sort((a, b) => a.start - b.start);
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addToFavoritesTripEvent(id) {
    const index = this._tripEvents.findIndex((tripEvent) => tripEvent.id === id);

    if (index === -1) {
      return false;
    }

    const updatedEvent = this._tripEvents[index];
    updatedEvent.isFavorite = !updatedEvent.isFavorite;

    return updatedEvent;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
