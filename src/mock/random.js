export const getRandomIntegerNumber = (min, max) => min + Math.floor(Math.random() * (max - min));

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomArrayLength = (min = 0, max = 6) => new Array(getRandomIntegerNumber(min, max)).fill(null);

export const getRandomDate = () => {
  const hours = getRandomIntegerNumber(0, 24);
  const minutes = getRandomIntegerNumber(0, 60);

  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(hours, minutes);

  return targetDate;
};

export const getRandomEndDate = (date) => {
  const duration = getRandomIntegerNumber(30, 2880);
  const endDate = new Date(date);

  endDate.setMinutes(endDate.getMinutes() + duration);

  return endDate;
};
