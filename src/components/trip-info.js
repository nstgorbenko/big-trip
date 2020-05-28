import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/date.js";
import {getTotalCost} from "../utils/cost.js";
import {getSortedTripEvents} from "../utils/sort.js";
import {SortType} from "../const.js";

const Separator = {
  DASH: ` — `,
  ELLIPSIS: ` — … — `,
};

const getFirstItem = (array) => array[0];
const getLastItem = (array) => array[array.length - 1];

const getTripTitle = (sortedTripEvents) => {
  const allTripEvents = sortedTripEvents.map(({destination}) => destination.name);
  const firstEventName = getFirstItem(allTripEvents);
  const lastEventName = getLastItem(allTripEvents);

  if (sortedTripEvents.length <= 3) {
    return allTripEvents.join(Separator.DASH);
  }
  return `${firstEventName} ${Separator.ELLIPSIS} ${lastEventName}`;
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

const createTripInfoTemplate = (tripEvents) => {
  const sortedTripEvents = getSortedTripEvents(tripEvents, SortType.DEFAULT);
  const noEvents = tripEvents.length === 0;
  const totalCost = getTotalCost(tripEvents);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${noEvents ? `` :
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${getTripTitle(sortedTripEvents)}</h1>

        <p class="trip-info__dates">${getTripDates(sortedTripEvents)}</p>
      </div>`}
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripEvents = []) {
    super();

    this._tripEvents = tripEvents;
  }

  resetData() {
    this._tripEvents = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripEvents);
  }
}
