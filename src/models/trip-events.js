import {FilterType} from "../const.js";
import {getEventsByFilter} from "../utils/filter.js";

export default class TripEvents {
  constructor() {
    this._tripEvents = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getAll() {
    return this._tripEvents;
  }

  get() {
    return getEventsByFilter(this._tripEvents, this._activeFilterType);
  }

  set(tripEvents) {
    this._tripEvents = Array.from(tripEvents);
    TripEvents.callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    TripEvents.callHandlers(this._filterChangeHandlers);
  }

  isEmpty() {
    return this.getAll().length === 0;
  }

  add(newEvent) {
    const newTripEvent = Object.assign({}, newEvent, {
      id: String(new Date() + Math.random())
    });
    this._tripEvents = [...this._tripEvents, newTripEvent];
    TripEvents.callHandlers(this._dataChangeHandlers);
  }

  deleteEvent(id) {
    const index = this._getEventIndex(id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      ...this._tripEvents.slice(index + 1)
    ];
    TripEvents.callHandlers(this._dataChangeHandlers);

    return true;
  }

  update(id, updatedEvent) {
    const index = this._getEventIndex(id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [
      ...this._tripEvents.slice(0, index),
      updatedEvent,
      ...this._tripEvents.slice(index + 1)
    ];
    TripEvents.callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _getEventIndex(id) {
    return this._tripEvents.findIndex((tripEvent) => tripEvent.id === id);
  }

  static callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

