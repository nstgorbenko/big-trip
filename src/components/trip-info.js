import AbstractComponent from "./abstract-component.js";
import {formatDay} from "../utils/date.js";
import {getTotalCost} from "../utils/cost.js";

const getDiffItem = (majorPoints, minorPoints) => majorPoints.filter((point) => minorPoints.indexOf(point) < 0);

const getTripTitle = (tripEvents) => {
  const sortedTripEvents = tripEvents.sort((a, b) => a.start - b.start);
  const startPointName = sortedTripEvents[0].destination.name;
  const endPointName = sortedTripEvents[sortedTripEvents.length - 1].destination.name;
  const allPoints = Array.from(sortedTripEvents.reduce((points, tripEvent) => points.add(tripEvent.destination.name), new Set()));

  if (allPoints.length === 1) {
    return startPointName;
  }
  if (allPoints.length === 2 && startPointName !== endPointName) {
    return `${startPointName} &mdash; ${endPointName}`;
  }
  if (allPoints.length === 2 && startPointName === endPointName) {
    return `${startPointName} &mdash; ${allPoints[1]} &mdash; ${endPointName}`;
  }
  if (allPoints.length === 3 && startPointName !== endPointName) {
    const middlePointName = getDiffItem(allPoints, [startPointName, endPointName])[0];
    return `${startPointName} &mdash; ${middlePointName} &mdash; ${endPointName}`;
  }

  return `${startPointName} &mdash; ... &mdash; ${endPointName}`;
};

const getTripDates = (tripEvents) => {
  const sortedTripEvents = tripEvents.sort((a, b) => a.start - b.start);
  const startPointDate = formatDay(sortedTripEvents[0].start);
  const startPointMonth = startPointDate.slice(0, 3);

  const endPointDate = formatDay(sortedTripEvents[sortedTripEvents.length - 1].end);
  const endPointMonth = endPointDate.slice(0, 3);
  const endPointDay = endPointDate.slice(-2);

  if (startPointDate === endPointDate) {
    return startPointDate;
  }
  if (startPointMonth === endPointMonth) {
    return `${startPointDate}&nbsp;&mdash;&nbsp;${endPointDay}`;
  }

  return `${startPointDate}&nbsp;&mdash;&nbsp;${endPointDate}`;
};

const createTripInfoTemplate = (tripEvents) => {
  const noEvents = tripEvents.length === 0;
  const totalCost = getTotalCost(tripEvents);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${noEvents ? `` :
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${getTripTitle(tripEvents)}</h1>

        <p class="trip-info__dates">${getTripDates(tripEvents)}</p>
      </div>`}
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripEvents) {
    super();

    this._tripEvents = tripEvents;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripEvents);
  }
}
