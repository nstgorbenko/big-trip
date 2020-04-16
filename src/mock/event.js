import {DESTINATION_DESCRIPTIONS, DESTINATION_ITEMS, eventToOffers, EVENT_TYPES} from "../const.js";

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomDate = () => {
  const hours = getRandomIntegerNumber(0, 24);
  const minutes = getRandomIntegerNumber(0, 60);

  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

const getRandomEndDate = (date) => {
  const duration = getRandomIntegerNumber(30, 2880);
  const endDate = new Date(date);

  endDate.setMinutes(endDate.getMinutes() + duration);

  return endDate;
};

let generateEvent = () => {
  const type = getRandomArrayItem(EVENT_TYPES);
  const start = getRandomDate();
  const end = getRandomEndDate(start);
  const offersCount = (offers) => {
    const min = Math.min(3, offers.length);
    return getRandomIntegerNumber(1, min);
  };
  const offers = eventToOffers.hasOwnProperty(type) && eventToOffers[type].length > 0 ? eventToOffers[type].slice(0, offersCount(eventToOffers[type])) : null;
  const description = Math.random() > 0.5 ? null : DESTINATION_DESCRIPTIONS.slice(0, getRandomIntegerNumber(1, 6)).join(` `);
  const photos = description === null ? null : new Array(getRandomIntegerNumber(1, 6)).fill(``)
    .map((it) => {
      return it + `http://picsum.photos/248/152?r=${Math.random()}}`;
    });
  const info = {
    description,
    photos
  };

  return {
    type,
    destination: getRandomArrayItem(DESTINATION_ITEMS),
    start,
    end,
    price: getRandomIntegerNumber(5, 300),
    offers,
    info,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};


export {generateEvents};
