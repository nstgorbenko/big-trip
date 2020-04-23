const getOffersCost = (offers, basePrice) => offers.reduce((offersCost, {price}) => offersCost + price, basePrice);

const getTotalCost = (tripEvents) =>
  tripEvents.reduce((cost, {basePrice, offers}) => {
    return cost + (offers.length > 0
      ? getOffersCost(offers, basePrice)
      : basePrice);
  }, 0);

export const createTripCostTemplate = (tripEvents) => {
  const totalCost = getTotalCost(tripEvents);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};
