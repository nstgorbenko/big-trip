import {getRandomIntegerNumber} from "./random.js";

const eventToOffers = {
  'Taxi': [{id: `uber`, title: `Order Uber`, price: 200}],
  'Bus': [],
  'Train': [],
  'Ship': [],
  'Transport': [],
  'Drive': [{id: `car`, title: `Rent a car`, price: 200}],
  'Flight': [{id: `luggage`, title: `Add luggage`, price: 50}, {id: `comfort`, title: `Switch to comfort`, price: 80}, {id: `meal`, title: `Add meal`, price: 15}, {id: `seats`, title: `Choose seats`, price: 5}, {id: `train`, title: `Travel by train`, price: 40}],
  'Check-in': [{id: `breakfast`, title: `Add breakfast`, price: 50}],
  'Sightseeing': [{id: `tickets`, title: `Book tickets`, price: 40}, {id: `lunch`, title: `Lunch in city`, price: 30}],
};

const offersCount = (offers) => {
  const min = Math.min(3, offers.length);
  return getRandomIntegerNumber(1, min + 1);
};

const getCheckedOffers = (type) => eventToOffers.hasOwnProperty(type) && eventToOffers[type].length > 0
  ? eventToOffers[type].slice(0, offersCount(eventToOffers[type]))
  : [];


export {eventToOffers, getCheckedOffers};
