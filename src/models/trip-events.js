import {FilterType} from "../const.js";
import {getEventsByFilter} from "../utils/filter.js";

export default class TripEvents {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._serverSyncHandlers = [];
  }

  set(tripEvents) {
    this._events = Array.from(tripEvents);
    TripEvents.callHandlers(this._dataChangeHandlers);
    TripEvents.callHandlers(this._serverSyncHandlers);
  }

  getAll() {
    return this._events;
  }

  get() {
    return getEventsByFilter(this._events, this._activeFilterType);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    TripEvents.callHandlers(this._filterChangeHandlers);
  }

  isEmpty() {
    return this._events.length === 0;
  }

  add(newEvent) {
    this._events = [...this._events, newEvent];
    TripEvents.callHandlers(this._dataChangeHandlers);
  }

  deleteEvent(id) {
    const index = this._getEventIndex(id);

    if (index === -1) {
      return false;
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];
    TripEvents.callHandlers(this._dataChangeHandlers);

    return true;
  }

  update(id, updatedEvent) {
    const index = this._getEventIndex(id);

    if (index === -1) {
      return false;
    }

    this._events = [
      ...this._events.slice(0, index),
      updatedEvent,
      ...this._events.slice(index + 1)
    ];
    TripEvents.callHandlers(this._dataChangeHandlers);

    return true;
  }

  addFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  addDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addServerSyncHandler(handler) {
    this._serverSyncHandlers.push(handler);
  }

  _getEventIndex(id) {
    return this._events.findIndex((tripEvent) => tripEvent.id === id);
  }

  static callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

