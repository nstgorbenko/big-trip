import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const defaultConfig = {
  'altInput': true,
  'altFormat': `d/m/y H:i`,
  'enableTime': true,
  'time_24hr': true,
};

export const setFlatpickr = (inputElement, options = {}) => flatpickr(inputElement, Object.assign({}, defaultConfig, options));
