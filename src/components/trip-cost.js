const getTotalCost = (tripEvents) => {
  return tripEvents.reduce((cost, tripEvent) => {
    cost += tripEvent.basePrice;
    if (tripEvent.checkedOffers !== null) {
      cost += tripEvent.checkedOffers.reduce((offersCost, offer) => offersCost + offer.price, 0);
    }
    return cost;
  }, 0);
};

export const createTripCostTemplate = (tripEvents) => {
  const totalCost = getTotalCost(tripEvents);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};
