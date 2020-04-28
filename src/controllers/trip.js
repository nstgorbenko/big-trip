import DayComponent from "../components/day.js";
import {isEscKey} from "../utils/common.js";
import NoEventsComponent from "../components/no-events.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import TripEventComponent from "../components/trip-event.js";
import {destinations} from "../mock/destination.js";
import {eventToOffers} from "../mock/offers.js";
import {formatDateToDayDatetime} from "../utils/date/formatters.js";
import {render, replace} from "../utils/dom.js";

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

const renderTripEvent = (tripEventsContainer, tripEvent) => {
  const replaceEventToEdit = () => replace(tripEventEditComponent, tripEventComponent);
  const replaceEditToEvent = () => replace(tripEventComponent, tripEventEditComponent);
  const onEscKeyDown = (evt) => {
    if (isEscKey(evt)) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const tripEventComponent = new TripEventComponent(tripEvent);
  const tripEventEditComponent = new TripEventEditComponent(tripEvent, destinations, eventToOffers);

  tripEventComponent.setRollupButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  tripEventEditComponent.setSubmitHandler(() => {
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripEventsContainer, tripEventComponent);
};

const renderAllDays = (tripDaysContainer, allDays) => {
  const days = Object.keys(allDays).sort();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayIndex = i + 1;
    const dayComponent = new DayComponent(day, dayIndex);
    const tripEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);

    render(tripDaysContainer, dayComponent);

    for (const tripEvent of allDays[day]) {
      renderTripEvent(tripEventsList, tripEvent);
    }
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
  }

  render(tripEvents) {
    const tripBoard = document.querySelector(`.trip-events`);
    if (tripEvents.length === 0) {
      render(tripBoard, this._noEventsComponent);
      return;
    }

    render(tripBoard, this._sortComponent);
    render(tripBoard, this._tripDaysComponent);

    const tripDays = this._tripDaysComponent.getElement();
    const eventsDays = groupEventsByDays(tripEvents, `start`);
    renderAllDays(tripDays, eventsDays);
  }
}
