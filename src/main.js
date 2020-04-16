import {createDayTemplate} from "./components/day.js";
import {createEventEditTemplate} from "./components/event-edit.js";
import {createEventTemplate} from "./components/event.js";
import {createFilterTemplate} from "./components/filter.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortTemplate} from "./components/sort.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripInfoTemplate} from "./components/trip-info.js";
import {generateEvents} from "./mock/event.js";
import {formatDateToDayDatetime} from "./utils.js";

const EVENT_COUNT = 20;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const groupEventsByDays = (someEvents, date) => {
  return someEvents.reduce(function (daysList, currentDay) {
    let someDate = formatDateToDayDatetime(currentDay[date]);

    if (!daysList.hasOwnProperty(someDate)) {
      daysList[someDate] = [];
    }
    daysList[someDate].push(currentDay);

    return daysList;
  }, {});
};

const renderAllDays = (allDaysList) => {
  const days = Object.keys(allDaysList).sort();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayIndex = i + 1;

    render(tripDaysElement, createDayTemplate(day, dayIndex));
    const tripEventsListElement = tripDaysElement.querySelector(`.day:last-child`).querySelector(`.trip-events__list`);

    for (const event of allDaysList[day]) {
      render(tripEventsListElement, createEventTemplate(event));
    }
  }
};

const events = generateEvents(EVENT_COUNT).sort((a, b) => a.start - b.start);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripViewHeadingElement = tripControlsElement.querySelector(`h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(events), `afterbegin`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(events));

render(tripViewHeadingElement, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate());
render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEventEditTemplate(events.shift()));
render(tripEventsElement, createTripDaysTemplate());
const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

const eventsDaysList = groupEventsByDays(events, `start`);
renderAllDays(eventsDaysList);
