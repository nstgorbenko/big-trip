import {createElement} from "../utils/dom.js";
import {formatDay} from "../utils/date/formatters.js";

const createDayTemplate = (day, index) => {
  const formattedDay = formatDay(day);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime=${day}>${formattedDay}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(day, index) {
    this._day = day;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
