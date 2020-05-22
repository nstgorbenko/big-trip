import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, remove} from "../utils/dom.js";
import {getEventsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripEventsModel.setDataChangeHandler(this._onDataChange);
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
    this._filterComponent.setChangeHandler(this._onFilterChange);

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

  _onFilterChange(filterType) {
    this._tripEventsModel.setFilter(filterType);
  }

  _onDataChange() {
    if (this._tripEventsModel.isEmpty()) {
      this.setDefault();
    }
    this.render();
  }
}
