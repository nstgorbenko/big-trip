import {eventTypesWithPrepositions} from "../const.js";
import {formatDateToEventDatetime, formatTime} from "../utils/date/formatters.js";
import {getDuration} from "../utils/date/duration.js";

const createOffersMarkup = (offers) => {
  const OFFERS_TO_SHOW = 3;

  return offers.slice(0, OFFERS_TO_SHOW).map((offer) => {
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

export const createTripEventTemplate = (tripEvent) => {
  const {type, destination, start, end, basePrice, offers} = tripEvent;

  const isOffersType = offers.length > 0;

  const startDatetime = formatDateToEventDatetime(start);
  const startTime = formatTime(start);

  const endDatetime = formatDateToEventDatetime(end);
  const endTime = formatTime(end);

  const duration = getDuration(start, end);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTypesWithPrepositions[type]} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
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
