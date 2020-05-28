import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/date.js";

const createDayTemplate = (day, counter = 0) => {
  const isCertainDay = counter > 0;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
    ${isCertainDay ?
      `<span class="day__counter">${counter}</span>
      <time class="day__date" datetime=${day}>${formatDate(day)}</time>` : ``}
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(day, counter) {
    super();

    this._day = day;
    this._counter = counter;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._counter);
  }
}
