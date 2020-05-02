import AbstractComponent from "./abstract-component.js";
import {formatDay} from "../utils/date/formatters.js";

const createDayTemplate = (day, number) => {
  const formattedDay = formatDay(day);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime=${day}>${formattedDay}</time>
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(day, number) {
    super();

    this._day = day;
    this._number = number;
  }

  getTemplate() {
    return createDayTemplate(this._day, this._number);
  }
}
