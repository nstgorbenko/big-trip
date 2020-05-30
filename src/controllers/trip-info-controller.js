import TripInfoComponent from "../components/trip-info.js";
import {render, replace, remove} from "../utils/dom.js";
import {RenderPosition} from "../const.js";

export default class TripInfoController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._tripInfoComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._tripEventsModel.addDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const tripEvents = this._tripEventsModel.getAll();

    const oldTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoComponent();
    this._tripInfoComponent.update(tripEvents);

    if (oldTripInfoComponent !== null) {
      replace(this._tripInfoComponent, oldTripInfoComponent);
      remove(oldTripInfoComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _dataChangeHandler() {
    this.render();
  }
}
