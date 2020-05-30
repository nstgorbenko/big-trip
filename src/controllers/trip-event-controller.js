import TripEventModel from "../models/trip-event.js";
import TripEventComponent from "../components/trip-event.js";
import TripEventEditComponent from "../components/trip-event-edit.js";
import {ActionType, DeleteButtonText, Mode, RenderPosition, SubmitButtonText} from "../const.js";
import {isEscKey} from "../utils/common.js";
import {remove, render, replace} from "../utils/dom.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class TripEventController {
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
    this._mode = mode;

    const oldTripEventComponent = this._tripEventComponent;
    const oldTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventComponent(tripEvent);
    this._tripEventEditComponent = new TripEventEditComponent(tripEvent, this._destinationsModel, this._offersModel);

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

  shake() {
    this._tripEventEditComponent.animate(true);

    setTimeout(() => {
      this._tripEventEditComponent.animate(false);
      this._tripEventEditComponent.setDisabled(false);
      this._tripEventEditComponent.setSubmitButtonText(SubmitButtonText.DEFAULT);
      if (this._mode === Mode.EDIT) {
        this._tripEventEditComponent.setDeleteButtonText(DeleteButtonText.DEFAULT);
      }
    }, SHAKE_ANIMATION_TIMEOUT);
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
      const newTripEvent = TripEventModel.parse(formData);

      this._tripEventEditComponent.setDisabled(true);
      this._tripEventEditComponent.setSubmitButtonText(SubmitButtonText.PENDING);

      this._dispatch({
        type: this._mode === Mode.EDIT ? ActionType.UPDATE : ActionType.ADD_NEW_EVENT,
        payload: {
          id: tripEvent.id,
          controller: this,
          newData: newTripEvent
        }});
    });

    this._tripEventEditComponent.setFavoriteButtonClickHandler(() => {
      const newTripEvent = TripEventModel.clone(tripEvent);
      newTripEvent.isFavorite = !newTripEvent.isFavorite;

      this._dispatch({
        type: ActionType.ADD_TO_FAVORITE,
        payload: {
          id: tripEvent.id,
          controller: this,
          newData: newTripEvent
        }});
    });

    this._tripEventEditComponent.setDeleteButtonClickHandler(() => {
      if (this._mode === Mode.EDIT) {
        this._tripEventEditComponent.setDisabled(true);
        this._tripEventEditComponent.setDeleteButtonText(DeleteButtonText.PENDING);
      }

      this._dispatch({
        type: this._mode === Mode.EDIT ? ActionType.DELETE : ActionType.REMOVE_NEW_EVENT,
        payload: {
          id: tripEvent.id,
          controller: this
        }
      });
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
