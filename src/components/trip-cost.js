import AbstractComponent from "./abstract-component.js";

const reduceOffersCost = (cost, {price}) => cost + price;
const reduceEventsCost = (cost, {basePrice, offers}) =>
  offers.length > 0
    ? offers.reduce(reduceOffersCost, cost + basePrice)
    : cost + basePrice;

const getTotalCost = (tripEvents) => tripEvents.reduce(reduceEventsCost, 0);

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
