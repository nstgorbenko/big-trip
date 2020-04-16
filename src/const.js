const DESTINATION_DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const DESTINATION_ITEMS = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`,
  `Tallinn`,
  `Munich`,
  `Rome`,
  `Prague`,
];

const eventGroups = {
  'Transfer': [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  'Activity': [`Check-in`, `Sightseeing`, `Restaurant`],
};

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

const EVENT_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const eventTypesWithPrepositions = {
  'Taxi': `Taxi to`,
  'Bus': `Bus to`,
  'Train': `Train to`,
  'Ship': `Ship to`,
  'Transport': `Transport to`,
  'Drive': `Drive to`,
  'Flight': `Flight to`,
  'Check-in': `Check-in in`,
  'Sightseeing': `Sightseeing in`,
  'Restaurant': `Restaurant in`,
};

const ordinalToMonth = {
  '01': `JAN`,
  '02': `FEB`,
  '03': `MAR`,
  '04': `APR`,
  '05': `MAY`,
  '06': `JUN`,
  '07': `JUL`,
  '08': `AUG`,
  '09': `SEP`,
  '10': `OCT`,
  '11': `NOV`,
  '12': `DEC`,
};

export {DESTINATION_DESCRIPTIONS, DESTINATION_ITEMS, eventGroups, eventToOffers, EVENT_TYPES, eventTypesWithPrepositions, ordinalToMonth};
