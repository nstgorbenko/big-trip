import {getCheckedOffers} from "./offers.js";
import {destinations} from "./destination.js";
import {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, getRandomEndDate} from "./random.js";

const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

const generateEvent = () => {
  const type = getRandomArrayItem(EVENT_TYPES);
  const destination = getRandomArrayItem(destinations);
  const start = getRandomDate();
  const end = getRandomEndDate(start);
  const offers = getCheckedOffers(type);

  return {
    id: String(new Date() + Math.random()),
    type,
    destination,
    start,
    end,
    basePrice: getRandomIntegerNumber(5, 300),
    offers,
    isFavorite: Math.random() > 0.5,
  };
};

export const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};
