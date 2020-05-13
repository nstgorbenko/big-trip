import AbstractSmartComponent from "./abstract-smart-component.js";
import {eventGroups, eventTypesWithPrepositions} from "../const.js";
import {formatDateToEventEdit} from "../utils/date/formatters.js";

const createEventsTypeMarkup = (eventTypes, currentType) => {
  return eventTypes.map((eventType) => {
    const lowercaseEventType = eventType.toLowerCase();
    const isChecked = eventType === currentType;

    return (
      `<div class="event__type-item">
        <input id="event-type-${lowercaseEventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowercaseEventType}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${lowercaseEventType}" for="event-type-${lowercaseEventType}-1">${eventType}</label>
      </div>`
    );
  }).join(`\n`);
};

const createEventGroupsMarkup = (groups, currentType) => {
  const groupNames = Object.keys(groups);

  return groupNames.map((groupName) => {
    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${groupName}</legend>
        ${createEventsTypeMarkup(groups[groupName], currentType)}
      </fieldset>`
    );
  }).join(`\n`);
};

const createDestinationsMarkup = (destinations) => {
  return destinations.map(({name}) => {
    return (
      `<option value="${name}"></option>`
    );
  }).join(`\n`);
};

const getOffers = (allOffers, checkedOffers) =>
  allOffers.reduce((offers, currentOffer) => {
    const isCheckedOffer = checkedOffers.some(({title}) =>
      title === currentOffer.title);

    currentOffer.isChecked = isCheckedOffer;
    offers.push(currentOffer);

    return offers;
  }, []);

const createOffersMarkup = (offers) => {
  return offers.map((offer, index) => {
    const {id, title, price, isChecked} = offer;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}-${index}" type="checkbox" name="event-offer-${id}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${id}-${index}">
          <span class="event__offer-title">${title}</span>
          +
          €&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createPhotosMarkup = (photos) => {
  return photos.map((photo) => {
    return (
      `<img class="event__photo" src="${photo.src}" alt="${photo.description}"></img>`
    );
  }).join(`\n`);
};

const createTripEventEditTemplate = (tripEvent, options = {}, destinations, allOffers) => {
  const {start, end, basePrice, offers} = tripEvent;
  const {type, destination, isFavorite} = options;

  const eventGroupsMarkup = createEventGroupsMarkup(eventGroups, type);
  const destinationsMarkup = createDestinationsMarkup(destinations);

  const isType = !!type;

  const isStartTime = !!start;
  const startTime = isStartTime ? formatDateToEventEdit(start) : ``;
  const isEndTime = !!start;
  const endTime = isEndTime ? formatDateToEventEdit(end) : ``;

  const description = destination.description;
  const photos = destination.photos;

  const allTripEventOffers = allOffers[type];
  const isOffersType = allTripEventOffers.length > 0;
  const isInfo = !!description;

  const favorite = isFavorite ? `checked` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${isType ? type.toLowerCase() : `taxi`}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
          ${eventGroupsMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${isType ? eventTypesWithPrepositions[type] : `Taxi to`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${(startTime)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
    ${isOffersType ?
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersMarkup(getOffers(allTripEventOffers, offers))}
        </div>
      </section>` : ``}

    ${isInfo ?
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPhotosMarkup(photos)}
          </div>
        </div>
      </section>` : ``}

      </section>
    </form>`
  );
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(tripEvent, destinations, allOffers) {
    super();

    this._tripEvent = tripEvent;
    this._destinations = destinations;
    this._allOffers = allOffers;

    this._type = tripEvent.type;
    this._destination = tripEvent.destination;
    this._isFavorite = tripEvent.isFavorite;

    this._favoriteButtonClickHandler = null;
    this._sumbitHandler = null;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._tripEvent, {
      type: this._type,
      destination: this._destination,
      isFavorite: this._isFavorite
    }, this._destinations, this._allOffers);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);
    this._favoriteButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._sumbitHandler = handler;
  }

  recoveryListeners() {
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setSubmitHandler(this._sumbitHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const tripEvent = this._tripEvent;

    this._type = tripEvent.type;
    this._destination = tripEvent.destination;
    this._isFavorite = tripEvent.isFavorite;

    this.rerender();
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const eventDestination = element.querySelector(`.event__input--destination`);

    element.querySelectorAll(`.event__type-input`).forEach((eventType) => {
      eventType.addEventListener(`change`, (evt) => {
        let newType = evt.target.value;
        newType = `${newType[0].toUpperCase()}${newType.slice(1)}`;
        if (newType !== this._type) {
          this._type = newType;
          this.rerender();
        }
      });
    });

    eventDestination.addEventListener(`click`, (evt) => {
      evt.target.value = ``;
    });

    eventDestination.addEventListener(`change`, (evt) => {
      const newDestinationName = evt.target.value;
      const newDestinationIndex = this._destinations.findIndex(({name}) => name === newDestinationName);

      if (newDestinationIndex === -1) {
        evt.target.value = ``;
        return;
      }

      this._destination = this._destinations[newDestinationIndex];
      this.rerender();
    });
  }
}