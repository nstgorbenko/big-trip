import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/date.js";

const createDayTemplate = (date, counter = 0) => {
  const isCertainDay = counter > 0;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
    ${isCertainDay ?
      `<span class="day__counter">${counter}</span>
      <time class="day__date" datetime=${date}>${formatDate(date)}</time>` : ``}
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, counter) {
    super();

    this._date = date;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._counter);
  }
}
