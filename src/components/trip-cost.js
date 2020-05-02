import AbstractComponent from "./abstract-component.js";

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

export default class TripCost extends AbstractComponent {
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;
  }

  getTemplate() {
    return createTripCostTemplate(this._tripEvents);
  }
}
