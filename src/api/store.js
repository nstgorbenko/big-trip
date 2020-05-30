const StoreName = {
  TRIP_EVENTS: `bigtrip-events`,
  DESTINATIONS: `bigtrip-destinations`,
  OFFERS: `bigtrip-offers`
};

export default class Store {
  constructor(storage) {
    this._storage = storage;
  }

  getTripEvents() {
    return this._getItems(StoreName.TRIP_EVENTS);
  }

  getDestinations() {
    return this._getItems(StoreName.DESTINATIONS);
  }

  getOffers() {
    return this._getItems(StoreName.OFFERS);
  }

  setTripEvents(tripEvents) {
    this._setItems(tripEvents, StoreName.TRIP_EVENTS);
  }

  setDestinations(destinations) {
    this._setItems(destinations, StoreName.DESTINATIONS);
  }

  setOffers(offers) {
    this._setItems(offers, StoreName.OFFERS);
  }

  setTripEvent(key, value) {
    const tripEventsStore = this.getTripEvents();

    this._storage.setItem(
        StoreName.TRIP_EVENTS,
        JSON.stringify(
            Object.assign({}, tripEventsStore, {
              [key]: value
            })
        )
    );
  }

  removeTripEvent(key) {
    const tripEventsStore = this.getTripEvents();
    delete tripEventsStore[key];

    this._storage.setItem(
        StoreName.TRIP_EVENTS,
        JSON.stringify(tripEventsStore)
    );
  }

  _getItems(storageKey) {
    try {
      return JSON.parse(this._storage.getItem(storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  _setItems(items, storageKey) {
    this._storage.setItem(
        storageKey,
        JSON.stringify(items)
    );
  }
}
