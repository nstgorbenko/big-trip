import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const defaultConfiguration = {
  'altInput': true,
  'altFormat': `d/m/y H:i`,
  'dateFormat': `Z`,
  'enableTime': true,
  'time_24hr': true,
};

export const createFlatpickr = (element, options = {}) =>
  flatpickr(element, Object.assign({}, defaultConfiguration, options));
