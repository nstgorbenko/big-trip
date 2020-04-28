import AbstractComponent from "./abstract-component.js";
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

export default class Day extends AbstractComponent {
  constructor(day, index) {
    super();

    this._day = day;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._index);
  }
}
