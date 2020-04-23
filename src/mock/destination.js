import {getRandomIntegerNumber, getRandomArrayItem, getRandomArrayLength} from "./random.js";

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

const getRandomPhoto = () => ({
  src: `http://picsum.photos/248/152?r=${Math.random()}`,
  description: `Event photo`,
});

const getDestination = () => {
  return {
    name: getRandomArrayItem(DESTINATION_ITEMS),
    description: Math.random() > 0.5 ? `` : DESTINATION_DESCRIPTIONS.slice(0, getRandomIntegerNumber(1, 6)).join(` `),
    photos: getRandomArrayLength(0, 6).map(getRandomPhoto),
  };
};

export {DESTINATION_ITEMS, getDestination};
