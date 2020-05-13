import TripEventComponent from "../components/trip-event.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import {ActionType} from "../const.js";
import {destinations} from "../mock/destination.js";
import {eventToOffers} from "../mock/offers.js";
import {isEscKey} from "../utils/common.js";
import {render, replace} from "../utils/dom.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TripEventController {
  constructor(container, dispatch) {
    this._container = container;
    this._dispatch = dispatch;

    this._mode = Mode.DEFAULT;
    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventEditComponent = new TripEventEditComponent(tripEvent, destinations, eventToOffers);

    this._tripEventComponent.setRollupButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._tripEventEditComponent.setSubmitHandler(() => {
      this._replaceEditToEvent();
    });

    this._tripEventEditComponent.setFavoriteButtonClickHandler(() => {
      this._dispatch({
        type: ActionType.ADD_TO_FAVORITE,
        payload: {
          id: tripEvent.id,
          tripEventController: this,
        }});
    });

    if (oldTripEventComponent && oldTripEventEditComponent) {
      replace(this._tripEventComponent, oldTripEventComponent);
      replace(this._tripEventEditComponent, oldTripEventEditComponent);
    } else {
      render(this._container, this._tripEventComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    this._dispatch({
      type: ActionType.TO_EDIT,
    });
    replace(this._tripEventEditComponent, this._tripEventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._tripEventEditComponent.reset();
    replace(this._tripEventComponent, this._tripEventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (isEscKey(evt)) {
      this._replaceEditToEvent();
    }
  }
}