import {addZero, formatDateToEventDatetime, formatTime} from "../utils.js";
import {eventTypesWithPrepositions} from "../const.js";

const createOffersMarkup = (offers) => {
  return offers.map((offer) => {
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

const formatDuration = (startTime, endTime) => {
  let duration = endTime - startTime;
  let minutes = Math.floor(duration / 60000);

  if (minutes < 60) {
    duration = `${addZero(minutes)}M`;
  } else {
    let hours = Math.floor(minutes / 60);
    if (hours < 24) {
      minutes %= 60;
      duration = `${addZero(hours)}H ${addZero(minutes)}M`;
    } else {
      let days = Math.floor(hours / 24);
      hours %= 24;
      minutes %= 60;
      duration = `${addZero(days)}D ${addZero(hours)}H ${addZero(minutes)}M`;
    }
  }
  return duration;
};

export const createEventTemplate = (event) => {
  const {type, destination, start, end, price, offers} = event;

  const isOffersType = !!offers;

  const startDatetime = formatDateToEventDatetime(start);
  const startTime = formatTime(start);

  const endDatetime = formatDateToEventDatetime(end);
  const endTime = formatTime(end);

  const duration = formatDuration(start, end);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventTypesWithPrepositions[type]} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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
