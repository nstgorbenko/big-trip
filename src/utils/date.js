import {addZero} from "./common.js";
import moment, {duration} from "moment";

export const formatDateToDayDatetime = (date) => moment(date).format(`YYYY-MM-DD`);

export const formatDateToEventEdit = (date) => moment(date).format(`DD/MM/YY HH:mm`);

export const formatDate = (date) => moment(date).format(`DD MMM`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const formatDuration = (endTime, startTime = 0) => {
  const {days, hours, minutes} = duration(endTime - startTime)._data;

  if (days > 0) {
    return `${addZero(days)}D ${addZero(hours)}H ${addZero(minutes)}M`;
  }
  if (hours > 0) {
    return `${addZero(hours)}H ${addZero(minutes)}M`;
  }

  return minutes > 0 ? `${addZero(minutes)}M` : ``;
};
