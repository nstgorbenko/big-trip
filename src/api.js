import Destination from "./models/destination.js";
import Offer from "./models/offer.js";
import TripEvent from "./models/trip-event.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Url = {
  TRIP_EVENTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
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
      .then(TripEvent.parse);
  }

  _getTripEvents() {
    return this._load({url: Url.TRIP_EVENTS})
      .then(TripEvent.parseAll);
  }

  _getDestinations() {
    return this._load({url: Url.DESTINATIONS})
    .then(Destination.parseAll);
  }

  _getOffers() {
    return this._load({url: Url.OFFERS})
    .then(Offer.parseAll);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
  }
}

