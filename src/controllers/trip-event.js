import TripEventModel from "../models/trip-event.js";
import TripEventComponent from "../components/trip-event.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import {ActionType, Mode, RenderPosition} from "../const.js";
import {isEscKey} from "../utils/common.js";
import {remove, render, replace} from "../utils/dom.js";

export default class TripEvent {
  constructor(container, destinationsModel, offersModel, dispatch) {
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._dispatch = dispatch;

    this._mode = Mode.DEFAULT;
    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(tripEvent, mode = Mode.DEFAULT) {
    const destinations = this._destinationsModel.get();
    const offers = this._offersModel.get();
    this._mode = mode;

    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventEditComponent = new TripEventEditComponent(tripEvent, destinations, offers);

    this._subscribeOnEvents(tripEvent);

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTripEventComponent !== null && oldTripEventEditComponent !== null) {
          this._replaceOldEventComponents(oldTripEventComponent, oldTripEventEditComponent);
          this._replaceEditToDefault();
        } else {
          render(this._container, this._tripEventComponent);
        }
        break;
      case Mode.EDIT:
        this._replaceOldEventComponents(oldTripEventComponent, oldTripEventEditComponent);
        break;
      case Mode.FIRST:
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        render(this._container, this._tripEventEditComponent);
        break;
      case Mode.ADD:
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        render(this._container, this._tripEventEditComponent, RenderPosition.BEFOREBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToDefault();
    }
  }

  _replaceDefaultToEdit() {
    this._dispatch({
      type: ActionType.TO_EDIT,
    });
    this._tripEventEditComponent.reset();
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.EDIT;
  }

  _replaceEditToDefault() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _replaceOldEventComponents(oldTripEventComponent, oldTripEventEditComponent) {
    replace(this._tripEventComponent, oldTripEventComponent);
    replace(this._tripEventEditComponent, oldTripEventEditComponent);
    remove(oldTripEventComponent);
    remove(oldTripEventEditComponent);
  }

  _subscribeOnEvents(tripEvent) {
    this._tripEventComponent.setRollupButtonClickHandler(() => {
      this._replaceDefaultToEdit();
    });

    this._tripEventEditComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToDefault();
    });

    this._tripEventEditComponent.setSubmitHandler(() => {
      const formData = this._tripEventEditComponent.getData();
      const destinations = this._destinationsModel.get();

      const destinationName = formData.get(`event-destination`);
      const destination = destinations.find(({name}) => name === destinationName);

      const offerInputs = Array.from(this._tripEventEditComponent.getElement().querySelectorAll(`.event__offer-checkbox:checked`));
      const checkedOffers = offerInputs.map(({name, value}) => {
        const offerTitle = name[0].toUpperCase() + name.slice(1);
        return {title: offerTitle, price: +value};
      });

      const newData = {
        "id": this._tripEventEditComponent._tripEvent.id,
        "type": formData.get(`event-type`),
        "destination": destination.convertToRaw(),
        "date_from": formData.get(`event-start-time`),
        "date_to": formData.get(`event-end-time`),
        "base_price": +formData.get(`event-price`),
        "offers": checkedOffers,
        "is_favorite": formData.has(`event-favorite`),
      };

      const newTripEvent = TripEventModel.parse(newData);
      this._dispatch({
        type: ActionType.UPDATE,
        payload: {
          id: tripEvent.id,
          controller: this,
          newData: newTripEvent
        }});
    });

    this._tripEventEditComponent.setFavoriteButtonClickHandler(() => {
      this._dispatch({
        type: ActionType.ADD_TO_FAVORITE,
        payload: {
          id: tripEvent.id,
          controller: this,
          newData: Object.assign({}, tripEvent, {
            isFavorite: !tripEvent.isFavorite
          })
        }});
    });

    this._tripEventEditComponent.setDeleteButtonClickHandler(() => {
      if (this._mode === Mode.ADD || this._mode === Mode.FIRST) {
        this._dispatch({
          type: ActionType.REMOVE_NEW_EVENT,
        });
      } else {
        this._dispatch({
          type: ActionType.DELETE,
          payload: {
            id: tripEvent.id
          }
        });
      }
    });
  }

  _escKeyDownHandler(evt) {
    if (isEscKey(evt)) {
      if (this._mode === Mode.ADD || this._mode === Mode.FIRST) {
        this._dispatch({
          type: ActionType.REMOVE_NEW_EVENT,
        });
        return;
      }
      this._replaceEditToDefault();
    }
  }
}
