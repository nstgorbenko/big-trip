import {addZero} from "../common.js";

const MILLIS_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export const getDuration = (startTime, endTime) => {
  const duration = endTime - startTime;
  const minutes = Math.floor(duration / MILLIS_IN_MINUTE);

  if (minutes < MINUTES_IN_HOUR) {
    return `${addZero(minutes)}M`;
  }

  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  if (hours < HOURS_IN_DAY) {
    const shownMinutes = minutes % MINUTES_IN_HOUR;
    return `${addZero(hours)}H ${addZero(shownMinutes)}M`;
  }

  const days = Math.floor(hours / HOURS_IN_DAY);
  const shownHours = hours % HOURS_IN_DAY;
  const shownMinutes = minutes % MINUTES_IN_HOUR;
  return `${addZero(days)}D ${addZero(shownHours)}H ${addZero(shownMinutes)}M`;
};
