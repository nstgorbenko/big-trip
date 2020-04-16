import {formatDateToTripInfo} from "../utils.js";

const getArrayDiff = (major, minor) => major.filter((i) => minor.indexOf(i) < 0);

const getTripTitle = (events) => {
  const startPointName = events[0].destination;
  const endPointName = events[events.length - 1].destination;
  const allPoints = Array.from(events.reduce((pointsList, event) => pointsList.add(event.destination), new Set()));
  let title = ``;

  if (allPoints.length === 1) {
    title = startPointName;
  } else if (allPoints.length === 2) {
    title = `${startPointName} &mdash; ${endPointName}`;
  } else if (allPoints.length === 3 && startPointName !== endPointName) {
    const middle = getArrayDiff(allPoints, [startPointName, endPointName])[0];
    title = `${startPointName} &mdash; ${middle} &mdash; ${endPointName}`;
  } else {
    title = `${startPointName} &mdash; ... &mdash; ${endPointName}`;
  }

  return title;
};

const getTripDates = (events) => {
  const startPointDate = formatDateToTripInfo(events[0].start);
  const startPointMonth = startPointDate.slice(0, 3);

  const endPointDate = formatDateToTripInfo(events[events.length - 1].end);
  const endPointMonth = endPointDate.slice(0, 3);
  const endPointDay = endPointDate.slice(-2);

  if (startPointDate === endPointDate) {
    return `${startPointDate}`;
  } else if (startPointMonth === endPointMonth) {
    return `${startPointDate}&nbsp;&mdash;&nbsp;${endPointDay}`;
  }

  return `${startPointDate}&nbsp;&mdash;&nbsp;${endPointDate}`;
};

export const createTripInfoTemplate = (eventsList) => {
  const tripTitle = getTripTitle(eventsList);
  const tripDates = getTripDates(eventsList);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripTitle}</h1>

        <p class="trip-info__dates">${tripDates}</p>
      </div>
    </section>`
  );
};
