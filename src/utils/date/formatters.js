import {ordinalToMonth} from "./mappings.js";

export const formatDateToISOString = (date) => {
  const formattedDate = new Date(date);
  formattedDate.setHours(formattedDate.getHours() - formattedDate.getTimezoneOffset() / 60);

  return formattedDate.toISOString();
};

export const formatDateToDayDatetime = (date) => {
  const ISODate = formatDateToISOString(date);

  return ISODate.slice(0, 10);
};

export const formatDateToEventDatetime = (date) => {
  const ISODate = formatDateToISOString(date);

  return ISODate.slice(0, 16);
};

export const formatDateToEventEdit = (date) => {
  const ISODate = formatDateToISOString(date);
  const day = ISODate.slice(8, 10);
  const month = ISODate.slice(5, 7);
  const year = ISODate.slice(2, 4);
  const hours = ISODate.slice(11, 13);
  const minutes = ISODate.slice(14, 16);

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatDateToTripInfo = (date) => {
  const ISODate = formatDateToISOString(date);
  const day = ISODate.slice(8, 10);
  const month = ordinalToMonth[ISODate.slice(5, 7)];

  return `${month} ${day}`;
};

export const formatDay = (datetime) => {
  const day = datetime.slice(-2);
  const month = ordinalToMonth[datetime.slice(-5, -3)];

  return `${month} ${day}`;
};

export const formatTime = (date) => date.toTimeString().slice(0, 5);
