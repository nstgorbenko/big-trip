import Destination from "../models/destination.js";
import Offer from "../models/offer.js";
import TripEvent from "../models/trip-event.js";

const Code = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Url = {
  TRIP_EVENTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
  SYNC_TRIP_EVENTS: `points/sync`
};

const checkStatus = (response) => {
  if (response.status >= Code.SUCCESS && response.status < Code.REDIRECTION) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getAllData() {
    return Promise.all([this._getTripEvents(), this._getDestinations(), this._getOffers()])
      .then(([tripEvents, destinations, offers]) => ({tripEvents, destinations, offers}));
  }

  updateTripEvent(id, newData) {
    return this._load({
      url: `${Url.TRIP_EVENTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(newData.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(API.convertToJson)
      .then(TripEvent.parse);
  }

  createTripEvent(newData) {
    return this._load({
      url: Url.TRIP_EVENTS,
      method: Method.POST,
      body: JSON.stringify(newData.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(API.convertToJson)
    .then(TripEvent.parse);
  }

  deleteTripEvent(id) {
    return this._load({
      url: `${Url.TRIP_EVENTS}/${id}`,
      method: Method.DELETE
    });
  }

  sync(tripEvents) {
    return this._load({
      url: Url.SYNC_TRIP_EVENTS,
      method: Method.POST,
      body: JSON.stringify(tripEvents),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(API.convertToJson);
  }

  _getTripEvents() {
    return this._load({url: Url.TRIP_EVENTS})
    .then(API.convertToJson)
    .then(TripEvent.parseAll);
  }

  _getDestinations() {
    return this._load({url: Url.DESTINATIONS})
    .then(API.convertToJson)
    .then(Destination.parseAll);
  }

  _getOffers() {
    return this._load({url: Url.OFFERS})
    .then(API.convertToJson)
    .then(Offer.parseAll);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }

  static convertToJson(response) {
    return response.json();
  }
}
