export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

const sortEventsByTime = (a, b) => (b.end - b.start) - (a.end - a.start);

const sortEventsByPrice = (a, b) => b.basePrice - a.basePrice;

export const getSortedTripEvents = ([...tripEvents], sortType) => {
  switch (sortType) {
    case SortType.TIME:
      return tripEvents.sort(sortEventsByTime);
    case SortType.PRICE:
      return tripEvents.sort(sortEventsByPrice);
    case SortType.DEFAULT:
      return tripEvents;
    default:
      throw new Error(`Unknown sort type: ${sortType}`);
  }
};
