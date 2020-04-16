import {formatDay} from "../utils.js";

export const createDayTemplate = (day, index) => {
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
