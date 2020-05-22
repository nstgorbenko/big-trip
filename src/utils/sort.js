import {SortType} from "../const.js";

const sortEventsByTime = (a, b) => (b.end - b.start) - (a.end - a.start);

const sortEventsByPrice = (a, b) => b.basePrice - a.basePrice;

const sortEventsByDate = (a, b) => a.start - b.start;

export const getSortedTripEvents = ([...tripEvents], sortType) => {
  switch (sortType) {
    case SortType.TIME:
      return tripEvents.sort(sortEventsByTime);
    case SortType.PRICE:
      return tripEvents.sort(sortEventsByPrice);
    case SortType.DEFAULT:
      return tripEvents.sort(sortEventsByDate);
    default:
      throw new Error(`Unknown sort type: ${sortType}`);
  }
};
