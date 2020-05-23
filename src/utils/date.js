import {addZero} from "./common.js";
import moment, {duration} from "moment";

export const formatDateToDayDatetime = (date) => moment(date).format(`YYYY-MM-DD`);

export const formatDateToEventEdit = (date) => moment(date).format(`DD/MM/YY HH:mm`);

export const formatDay = (date) => moment(date).format(`MMM DD`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const getDuration = (endTime, startTime = 0) => {
  let {days, hours, minutes} = duration(endTime - startTime)._data;

  days = days > 0 ? `${addZero(days)}D ` : ``;
  hours = hours > 0 ? `${addZero(hours)}H ` : ``;
  minutes = minutes > 0 ? `${addZero(minutes)}M` : ``;

  return `${days}${hours}${minutes}`;
};
