import {remove, render, replace} from "../utils/dom.js";
import {RenderPosition} from "../const.js";
import StatisticsComponent from "../components/statistics.js";

export default class StatisticsController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._isChartShouldUpdate = true;
    this._statisticsComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._tripEventsModel.addDataChangeHandler(this._dataChangeHandler);
  }

  show() {
    if (this._isChartShouldUpdate) {
      this._render();
      this._isChartShouldUpdate = false;
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
    this._statisticsComponent = new StatisticsComponent();
    this._statisticsComponent.update(tripEvents);

    if (oldStatisticsComponent !== null) {
      replace(this._statisticsComponent, oldStatisticsComponent);
      remove(oldStatisticsComponent);
    } else {
      render(container, this._statisticsComponent, RenderPosition.AFTEREND);
    }
  }

  _dataChangeHandler() {
    this._isChartShouldUpdate = true;
  }
}
