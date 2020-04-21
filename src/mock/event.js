import {eventToOffers, getCheckedOffers} from "./offers.js";
import {DESTINATION_ITEMS, getDestination} from "./destination.js";
import {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, getRandomEndDate} from "./random.js";

const EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const generateEvent = () => {
  const type = getRandomArrayItem(EVENT_TYPES);
  const start = getRandomDate();
  const end = getRandomEndDate(start);
  const checkedOffers = getCheckedOffers(type);
  const offers = eventToOffers[type];

  return {
    type,
    destination: getDestination(),
    destinations: DESTINATION_ITEMS,
    start,
    end,
    basePrice: getRandomIntegerNumber(5, 300),
    checkedOffers,
    offers,
    isFavourite: Math.random() > 0.5,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};


export {generateEvents};
