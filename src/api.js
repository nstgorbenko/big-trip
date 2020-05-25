import Destination from "./models/destination.js";
import Offer from "./models/offer.js";
import TripEvent from "./models/trip-event.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    return [];
  }
};

export default class API {
  getAllData() {
    return Promise.all([this._getTripEvents(), this._getDestinations(), this._getOffers()])
      .then(([tripEvents, destinations, offers]) => {
        return {
          tripEvents,
          destinations,
          offers
        };
      });
  }

  updateTripEvent(id, newData) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(newData.convertToRaw()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(TripEvent.parse);
  }

  _getTripEvents() {
    return this._load({url: `points`})
      .then(TripEvent.parseAll);
  }

  _getDestinations() {
    return this._load({url: `destinations`})
    .then(Destination.parseAll);
  }

  _getOffers() {
    return this._load({url: `offers`})
    .then(Offer.parseAll);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, `Basic jzkskbfjkse6788gisnfkj=`);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}

