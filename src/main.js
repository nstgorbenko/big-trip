import {createDayTemplate} from "./components/day.js";
import {createFilterTemplate} from "./components/filter.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripEventEditTemplate} from "./components/trip-event-edit.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {DESTINATION_ITEMS} from "./mock/destination.js";
import {eventToOffers} from "./mock/offers.js";
import {formatDateToDayDatetime} from "./utils/date/formatters.js";
import {generateEvents} from "./mock/event.js";
import {render} from "./utils/dom.js";

const EVENT_COUNT = 20;

const groupEventsByDays = (someEvents, date) => {
  return someEvents.reduce((days, currentDay) => {
    const someDate = formatDateToDayDatetime(currentDay[date]);

    if (!days.hasOwnProperty(someDate)) {
      days[someDate] = [];
    }
    days[someDate].push(currentDay);

    return days;
  }, {});
};

const renderAllDays = (allDays) => {
  const days = Object.keys(allDays).sort();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayIndex = i + 1;

    render(tripDaysElement, createDayTemplate(day, dayIndex));
    const tripEventsListElement = tripDaysElement.querySelector(`.day:last-child`).querySelector(`.trip-events__list`);

    for (const tripEvent of allDays[day]) {
      render(tripEventsListElement, createTripEventTemplate(tripEvent));
    }
  }
};

const tripEvents = generateEvents(EVENT_COUNT).sort((a, b) => a.start - b.start);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripViewHeadingElement = tripControlsElement.querySelector(`h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(tripEvents), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(tripEvents));

render(tripViewHeadingElement, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate());
render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createTripEventEditTemplate(tripEvents.shift(), DESTINATION_ITEMS, eventToOffers));
render(tripEventsElement, createTripDaysTemplate());
const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

const eventsDays = groupEventsByDays(tripEvents, `start`);
renderAllDays(eventsDays);
