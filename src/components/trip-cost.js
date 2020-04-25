import {createElement} from "../utils/dom.js";

const getOffersCost = (offers, basePrice) => offers.reduce((offersCost, {price}) => offersCost + price, basePrice);

const getTotalCost = (tripEvents) =>
  tripEvents.reduce((cost, {basePrice, offers}) => {
    return cost + (offers.length > 0
      ? getOffersCost(offers, basePrice)
      : basePrice);
  }, 0);

const createTripCostTemplate = (tripEvents) => {
  const totalCost = getTotalCost(tripEvents);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(tripEvents) {
    this._tripEvents = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._tripEvents);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
