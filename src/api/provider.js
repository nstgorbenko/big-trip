import Destination from "../models/destination.js";
import Offer from "../models/offer.js";
import TripEvent from "../models/trip-event.js";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreEventsStructure = (tripEvents) => {
  return tripEvents.reduce((storeEvents, tripEvent) => {
    storeEvents[tripEvent.id] = tripEvent;
    return storeEvents;
  }, {});
};

const getSyncedEvents = (tripEvents) => {
  return tripEvents.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, store, tripEventsModel) {
    this._api = api;
    this._store = store;
    this._tripEventsModel = tripEventsModel;

    this._isNeedToSync = false;
  }

  getAllData() {
    if (isOnline()) {
      return this._api.getAllData()
        .then(({tripEvents, destinations, offers}) => {
          const tripItems = createStoreEventsStructure(tripEvents.map((tripEvent) => tripEvent.convertToRaw()));

          this._store.setTripEvents(tripItems);
          this._store.setDestinations(destinations.map((destination) => destination.convertToRaw()));
          this._store.setOffers(offers);

          return {tripEvents, destinations, offers};
        });
    }
    const storeTripEvents = TripEvent.parseAll(Object.values(this._store.getTripEvents()));
    const storeDestinations = Destination.parseAll(this._store.getDestinations());
    const storeOffers = Offer.parseAll(this._store.getOffers());

    return Promise.resolve({
      tripEvents: storeTripEvents,
      destinations: storeDestinations,
      offers: storeOffers
    });
  }

  updateTripEvent(id, newData) {
    if (isOnline()) {
      return this._api.updateTripEvent(id, newData)
        .then((tripEvent) => {
          this._store.setTripEvent(tripEvent.id, tripEvent.convertToRaw());
          return tripEvent;
        });
    }

    this._store.setTripEvent(id, newData.convertToRaw());
    this._isNeedToSync = true;
    return Promise.resolve(newData);
  }

  createTripEvent(newData) {
    if (isOnline()) {
      return this._api.createTripEvent(newData)
        .then((tripEvent) => {
          this._store.setTripEvent(tripEvent.id, tripEvent.convertToRaw());
          return tripEvent;
        });
    }

    const storeNewTripEventId = nanoid();
    const storeNewTripEvent = TripEvent.clone(Object.assign(newData, {id: storeNewTripEventId}));
    this._store.setTripEvent(storeNewTripEvent.id, storeNewTripEvent.convertToRaw());
    this._isNeedToSync = true;

    return Promise.resolve(storeNewTripEvent);
  }

  deleteTripEvent(id) {
    if (isOnline()) {
      return this._api.deleteTripEvent(id)
        .then(() => this._store.removeTripEvent(id));
    }

    this._store.removeTripEvent(id);
    this._isNeedToSync = true;
    return Promise.resolve();
  }

  isOutdated() {
    return this._isNeedToSync;
  }

  sync() {
    if (isOnline()) {
      const storeTripEvents = Object.values(this._store.getTripEvents());
      return this._api.sync(storeTripEvents)
        .then((response) => {
          const createdTripEvents = response.created;
          const updatedTripEvents = getSyncedEvents(response.updated);
          const tripItems = createStoreEventsStructure([...createdTripEvents, ...updatedTripEvents]);

          this._store.setTripEvents(tripItems);
          this._isNeedToSync = false;
          this._tripEventsModel.set(TripEvent.parseAll(Object.values(tripItems)));
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
