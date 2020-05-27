import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, remove} from "../utils/dom.js";
import {getEventsByFilter} from "../utils/filter.js";

export default class Filter {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._filterComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._tripEventsModel.addDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allEvents = this._tripEventsModel.getAll();
    const activeFilter = this._filterComponent === null ? FilterType.ALL : this._filterComponent.getActiveType();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getEventsByFilter(allEvents, filterType).length,
        checked: filterType === activeFilter,
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters, activeFilter);
    this._filterComponent.setChangeHandler(this._filterChangeHandler);

    if (oldFilterComponent !== null) {
      replace(this._filterComponent, oldFilterComponent);
      remove(oldFilterComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  setDefault() {
    this._filterComponent.setDefault();
    this._tripEventsModel.setFilter(FilterType.ALL);
  }

  hide() {
    this._filterComponent.hide();
  }

  show() {
    this._filterComponent.show();
  }

  _filterChangeHandler(filterType) {
    this._tripEventsModel.setFilter(filterType);
  }

  _dataChangeHandler() {
    if (this._tripEventsModel.isEmpty() && this._filterComponent !== null) {
      this.setDefault();
    }
    this.render();
  }
}
