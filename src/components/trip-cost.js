const getTotalCost = (events) => {
  return events.reduce((cost, event) => {
    cost += event.price;
    if (event.offers !== null) {
      cost += event.offers.reduce((offersCost, offer) => offersCost + offer.price, 0);
    }
    return cost;
  }, 0);
};

export const createTripCostTemplate = (eventsList) => {
  const totalCost = getTotalCost(eventsList);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};
