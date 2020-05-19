import TripInfoComponent from "../components/trip-info.js";
import {render, replace, remove} from "../utils/dom.js";
import {RenderPosition} from "../const.js";

export default class TripInfoController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._tripInfoComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._tripEventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const tripEvents = this._tripEventsModel.getAllEvents();

    const oldTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoComponent(tripEvents);

    if (oldTripInfoComponent) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
      remove(oldTripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
