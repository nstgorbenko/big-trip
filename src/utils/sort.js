export const SortType = {
  TIME: `sort-time`,
  PRICE: `sort-price`,
  DEFAULT: `sort-event`,
};

const sortEventsByTime = (firstEvent, secondEvent) => {
  const firstEventDuration = firstEvent.end - firstEvent.start;
  const secondEventDuration = secondEvent.end - secondEvent.start;

  return secondEventDuration - firstEventDuration;
};

const sortEventsByPrice = (firstEvent, secondEvent) => secondEvent.basePrice - firstEvent.basePrice;

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
