const reduceOffersCost = (cost, {price}) => cost + price;

const reduceEventsCost = (cost, {basePrice, offers}) =>
  offers.length > 0
    ? offers.reduce(reduceOffersCost, cost + basePrice)
    : cost + basePrice;

export const getTotalCost = (tripEvents) => tripEvents.reduce(reduceEventsCost, 0);
