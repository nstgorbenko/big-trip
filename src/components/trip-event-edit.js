import AbstractSmartComponent from "./abstract-smart-component.js";
import {createFlatpickr} from "../utils/flatpickr.js";
import {eventGroupToTypes, eventTypeToPreposition} from "../dict.js";
import {formatDateToEventEdit} from "../utils/date.js";
import {createNewEvent} from "../utils/common.js";

const createEventsTypeMarkup = (eventTypes, currentType) => {
  return eventTypes.map((eventType) => {
    const lowercaseEventType = eventType.toLowerCase();
    const isChecked = lowercaseEventType === currentType;

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
    const {title, price, isChecked} = offer;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="${title}" ${isChecked ? `checked` : ``} value="${price}">
        <label class="event__offer-label" for="event-offer-${index}">
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

const getTypeWithPreposition = (type) => eventTypeToPreposition.get(type) || ``;
const getTripEventOffers = (type, allOffers) => allOffers[type] || [];

const createTripEventEditTemplate = (tripEvent, options = {}) => {
  const {id, basePrice, isFavorite} = tripEvent;
  const {type, destination, start, end, offers, allDestinations, allOffers} = options;

  const eventGroupsMarkup = createEventGroupsMarkup(eventGroupToTypes, type);
  const destinationsMarkup = createDestinationsMarkup(allDestinations);

  const isNewEvent = !id;
  const isStartTime = !!start;
  const startTime = isStartTime ? formatDateToEventEdit(start) : ``;
  const isEndTime = !!start;
  const endTime = isEndTime ? formatDateToEventEdit(end) : ``;

  const description = destination.description;
  const photos = destination.photos;

  const allTripEventOffers = getTripEventOffers(type, allOffers);
  const isOffersType = allTripEventOffers.length > 0;
  const isInfo = description.length > 0 || photos.length > 0;
  const isEventDetails = isOffersType || isInfo;

  const favorite = isFavorite ? `checked` : ``;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
          ${eventGroupsMarkup}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${getTypeWithPreposition(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" required list="destination-list-1">
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `Delete`}</button>
      ${isNewEvent ? `` :
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`}
      </header>
      ${isEventDetails ?
      `<section class="event__details">
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

      </section>` : ``}
    </form>`
  );
};

export default class TripEventEdit extends AbstractSmartComponent {
  constructor(tripEvent = createNewEvent(), destinationsModel = [], offersModel = []) {
    super();

    this._tripEvent = tripEvent;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._type = tripEvent.type;
    this._destination = tripEvent.destination;
    this._start = tripEvent.start;
    this._end = tripEvent.end;
    this._offers = tripEvent.offers;

    this._favoriteButtonClickHandler = null;
    this._submitHandler = null;
    this._rollupButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._startFlatpickr = null;
    this._endFlatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTripEventEditTemplate(this._tripEvent, {
      type: this._type,
      destination: this._destination,
      start: this._start,
      end: this._end,
      offers: this._offers,
      allDestinations: this._destinationsModel.get() || [],
      allOffers: this._offersModel.get() || []
    });
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);

    const destination = this._destinationsModel.find(formData.get(`event-destination`));

    const offerInputs = Array.from(this.getElement().querySelectorAll(`.event__offer-checkbox:checked`));
    const checkedOffers = offerInputs.map(({name, value}) => ({title: name, price: +value}));

    return {
      "id": this._tripEvent.id,
      "type": formData.get(`event-type`),
      "destination": destination.convertToRaw(),
      "date_from": formData.get(`event-start-time`),
      "date_to": formData.get(`event-end-time`),
      "base_price": +formData.get(`event-price`),
      "offers": checkedOffers,
      "is_favorite": formData.has(`event-favorite`),
    };
  }

  setFavoriteButtonClickHandler(handler) {
    this._favoriteButtonClickHandler = handler;

    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (favoriteButton) {
      favoriteButton.addEventListener(`change`, handler);
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      handler();
    });
    this._submitHandler = handler;
  }

  setRollupButtonClickHandler(handler) {
    this._rollupButtonClickHandler = handler;

    const rollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (rollupButton) {
      rollupButton.addEventListener(`click`, handler);
    }
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  recoveryListeners() {
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    this._removeFlatpickr();
    super.removeElement();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const tripEvent = this._tripEvent;

    this._type = tripEvent.type;
    this._destination = tripEvent.destination;
    this._start = tripEvent.start;
    this._end = tripEvent.end;
    this._offers = tripEvent.offers;
    this._isFavorite = tripEvent.isFavorite;

    this.rerender();
  }

  _applyFlatpickr() {
    this._removeFlatpickr();

    const startTime = this.getElement().querySelector(`input[name=event-start-time]`);
    const endTime = this.getElement().querySelector(`input[name=event-end-time]`);

    this._startFlatpickr = createFlatpickr(startTime, {
      defaultDate: this._start,
      maxDate: this._end,
      onClose: ([dateStart]) => {
        this._endFlatpickr.set(`minDate`, dateStart);
      },
    });

    this._endFlatpickr = createFlatpickr(endTime, {
      defaultDate: this._end,
      minDate: this._start,
      onClose: ([dateEnd]) => {
        this._startFlatpickr.set(`maxDate`, dateEnd);
      }
    });
  }

  _removeFlatpickr() {
    if (this._startFlatpickr !== null) {
      this._startFlatpickr.destroy();
      this._startFlatpickr = null;
    }

    if (this._endFlatpickr !== null) {
      this._endFlatpickr.destroy();
      this._endFlatpickr = null;
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const eventDestination = element.querySelector(`.event__input--destination`);

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._offers = [];
        this.rerender();
      });

    eventDestination.addEventListener(`focus`, (evt) => {
      const target = evt.target;

      target.placeholder = target.value;
      target.value = ``;

      eventDestination.addEventListener(`blur`, () => {
        if (target.value.length === 0) {
          target.value = target.placeholder;
        }
      }, {once: true});
    });

    eventDestination.addEventListener(`input`, (evt) => {
      const newDestinationName = evt.target.value;
      const newDestination = this._destinationsModel.find(newDestinationName);

      if (newDestination === null) {
        evt.target.value = ``;
        return;
      }

      this._destination = newDestination;
      this.rerender();
    });
  }
}
