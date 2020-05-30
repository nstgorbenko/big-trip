import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/date.js";
import {getTotalCost} from "../utils/cost.js";
import {getSortedTripEvents} from "../utils/sort.js";
import {SortType} from "../const.js";

const DESTINATIONS_TRUNCATE = 3;
const Separator = {
  DASH: ` — `,
  ELLIPSIS: ` — … — `,
};

const getFirstItem = (array) => array[0];
const getLastItem = (array) => array[array.length - 1];

const getTripTitle = (sortedTripEvents) => {
  const allTripEvents = sortedTripEvents.map(({destination}) => destination.name);

  return sortedTripEvents.length > DESTINATIONS_TRUNCATE
    ? `${getFirstItem(allTripEvents)} ${Separator.ELLIPSIS} ${getLastItem(allTripEvents)}`
    : allTripEvents.join(Separator.DASH);
};

const getTripDates = (sortedTripEvents) => {
  const firstEvent = getFirstItem(sortedTripEvents);
  const firstEventDate = formatDate(firstEvent.start);

  const lastEvent = getLastItem(sortedTripEvents);
  const lastEventDate = formatDate(lastEvent.end);

  if (firstEventDate === lastEventDate) {
    return firstEventDate;
  }
  return `${firstEventDate} ${Separator.DASH} ${lastEventDate}`;
};

const createTripInfoTemplate = (title, dates, cost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor() {
    super();

    this._title = ``;
    this._dates = ``;
    this._cost = 0;
  }

  getTemplate() {
    return createTripInfoTemplate(this._title, this._dates, this._cost);
  }

  update(tripEvents) {
    const sortedTripEvents = getSortedTripEvents(tripEvents, SortType.DEFAULT);

    this._title = getTripTitle(sortedTripEvents);
    this._dates = getTripDates(sortedTripEvents);
    this._cost = getTotalCost(tripEvents);

    this.getElement().querySelector(`.trip-info__title`).textContent = this._title;
    this.getElement().querySelector(`.trip-info__dates`).textContent = this._dates;
    this.getElement().querySelector(`.trip-info__cost-value`).textContent = this._cost;
  }
}
