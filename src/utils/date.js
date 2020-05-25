import {addZero} from "./common.js";
import moment, {duration} from "moment";

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export const formatDateToDayDatetime = (date) => moment(date).format(`YYYY-MM-DD`);

export const formatDateToEventEdit = (date) => moment(date).format(`DD/MM/YY HH:mm`);

export const formatDay = (date) => moment(date).format(`MMM DD`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const formatDuration = (endTime, startTime = 0) => {
  const period = duration(endTime - startTime);

  const minutes = period._data.minutes;
  const totlalMinutes = period.asMinutes();
  if (totlalMinutes < MINUTES_IN_HOUR) {
    return `${addZero(minutes)}M`;
  }

  const hours = period._data.hours;
  const totalHours = period.asHours();
  if (totalHours < HOURS_IN_DAY) {
    return `${addZero(hours)}H ${addZero(minutes)}M`;
  }

  const days = period._data.days;
  return `${addZero(days)}D ${addZero(hours)}H ${addZero(minutes)}M`;
};
