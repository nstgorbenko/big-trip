import AbstractComponent from "./abstract-component.js";
import {createNewEvent} from "../utils/common.js";
import {eventTypeToPreposition} from "../dict.js";
import {formatTime, formatDuration} from "../utils/date.js";

const OFFERS_TO_SHOW = 3;

const truncateOffers = (offers) =>
  offers.length > OFFERS_TO_SHOW
    ? offers.slice(0, OFFERS_TO_SHOW)
    : offers;

const createOffersMarkup = (offers) => {
  return truncateOffers(offers).map((offer) => {
    const {title, price} = offer;

    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createTripEventTemplate = (tripEvent) => {
  const {type, destination, start, end, basePrice, offers} = tripEvent;

  const isOffersType = offers.length > 0;

  const startTime = formatTime(start);
  const endTime = formatTime(end);
  const duration = formatDuration(end, start);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTypeToPreposition.get(type)} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${start.toISOString()}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${end.toISOString()}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

    ${isOffersType ?
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersMarkup(offers)}
      </ul>` : ``}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripEvent extends AbstractComponent {
  constructor(tripEvent = createNewEvent()) {
    super();

    this._item = tripEvent;
  }

  getTemplate() {
    return createTripEventTemplate(this._item);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
