import {getRandomIntegerNumber} from "./random.js";

export const eventToOffers = {
  'Taxi': [{id: `uber`, title: `Order Uber`, price: 200}],
  'Bus': [],
  'Train': [],
  'Ship': [],
  'Transport': [],
  'Drive': [{id: `car`, title: `Rent a car`, price: 200}],
  'Flight': [{id: `luggage`, title: `Add luggage`, price: 50}, {id: `comfort`, title: `Switch to comfort`, price: 80}, {id: `meal`, title: `Add meal`, price: 15}, {id: `seats`, title: `Choose seats`, price: 5}, {id: `train`, title: `Travel by train`, price: 40}],
  'Check-in': [{id: `breakfast`, title: `Add breakfast`, price: 50}],
  'Sightseeing': [{id: `tickets`, title: `Book tickets`, price: 40}, {id: `lunch`, title: `Lunch in city`, price: 30}],
  'Restaurant': []
};

const offersCount = (offers) => getRandomIntegerNumber(1, offers.length + 1);

export const getCheckedOffers = (type) => eventToOffers.hasOwnProperty(type) && eventToOffers[type].length > 0
  ? eventToOffers[type].slice(0, offersCount(eventToOffers[type]))
  : [];

