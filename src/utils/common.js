import {FilterType} from "../const.js";

const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const addZero = (number) => String(number).padStart(2, `0`);

export const isEscKey = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;

const getAllEvents = (tripEvents) => {
  return tripEvents.sort((a, b) => a.start - b.start);
};

const getFutureEvents = (tripEvents) => {
  const nowDate = new Date();
  return tripEvents.filter((tripEvent) => tripEvent.start > nowDate);
};

const getPastEvents = (tripEvents) => {
  const nowDate = new Date();
  return tripEvents.filter((tripEvent) => tripEvent.start <= nowDate);
};

export const getEventsByFilter = (tripEvents, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getAllEvents(tripEvents);
    case FilterType.FUTURE:
      return getFutureEvents(tripEvents);
    case FilterType.PAST:
      return getPastEvents(tripEvents);
    default:
      throw new Error(`Unknown filter type: ${filterType}`);
  }
};
