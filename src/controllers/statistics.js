import {remove, render, replace} from "../utils/dom.js";
import {RenderPosition} from "../const.js";
import StatisticsComponent from "../components/statistics.js";

export default class Statistics {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._shouldChartUpdate = true;
    this._statisticsComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._tripEventsModel.addDataChangeHandler(this._onDataChange);
  }

  show() {
    if (this._shouldChartUpdate) {
      this._render();
      this._shouldChartUpdate = false;
    }

    this._statisticsComponent.show();
  }

  hide() {
    this._statisticsComponent.hide();
  }

  _render() {
    const container = this._container;
    const tripEvents = this._tripEventsModel.getAll();

    const oldStatisticsComponent = this._statisticsComponent;
    this._statisticsComponent = new StatisticsComponent(tripEvents);

    if (oldStatisticsComponent !== null) {
      replace(this._statisticsComponent, oldStatisticsComponent);
      remove(oldStatisticsComponent);
    } else {
      render(container, this._statisticsComponent, RenderPosition.AFTEREND);
    }
  }

  _onDataChange() {
    this._shouldChartUpdate = true;
  }
}
