import AbstractComponent from "./abstract-component.js";
import {formatDateToTripInfo} from "../utils/date/formatters.js";

const getDiffItem = (majorPoints, minorPoints) => majorPoints.filter((point) => minorPoints.indexOf(point) < 0);

const getTripTitle = (tripEvents) => {
  const startPointName = tripEvents[0].destination.name;
  const endPointName = tripEvents[tripEvents.length - 1].destination.name;
  const allPoints = Array.from(tripEvents.reduce((points, tripEvent) => points.add(tripEvent.destination.name), new Set()));

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
  const startPointDate = formatDateToTripInfo(tripEvents[0].start);
  const startPointMonth = startPointDate.slice(0, 3);

  const endPointDate = formatDateToTripInfo(tripEvents[tripEvents.length - 1].end);
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

const reduceOffersCost = (cost, {price}) => cost + price;
const reduceEventsCost = (cost, {basePrice, offers}) =>
  offers.length > 0
    ? offers.reduce(reduceOffersCost, cost + basePrice)
    : cost + basePrice;

const getTotalCost = (tripEvents) => tripEvents.reduce(reduceEventsCost, 0);

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
