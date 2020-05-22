import {FilterType} from "../const.js";

const getFutureEvents = (tripEvents, now) => {
  return tripEvents.filter((tripEvent) => tripEvent.start > now);
};

const getPastEvents = (tripEvents, now) => {
  return tripEvents.filter((tripEvent) => tripEvent.start < now);
};

export const getEventsByFilter = (tripEvents, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return tripEvents;
    case FilterType.FUTURE:
      return getFutureEvents(tripEvents, Date.now());
    case FilterType.PAST:
      return getPastEvents(tripEvents, Date.now());
    default:
      throw new Error(`Unknown filter type: ${filterType}`);
  }
};
