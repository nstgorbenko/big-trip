import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace} from "../utils/dom.js";
import {getEventsByFilter} from "../utils/common.js";

export default class FilterController {
  constructor(container, tripEventsModel) {
    this._container = container;
    this._tripEventsModel = tripEventsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripEventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allEvents = this._tripEventsModel.getAllEvents();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getEventsByFilter(allEvents, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  setDefaultFilterType() {
    this._activeFilterType = FilterType.ALL;
    this._filterComponent.setDefault();
    this._tripEventsModel.setFilter(this._activeFilterType);
  }

  _onFilterChange(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }
    this._activeFilterType = filterType;
    this._tripEventsModel.setFilter(filterType);
  }

  _onDataChange() {
    const allEvents = this._tripEventsModel.getAllEvents();
    if (allEvents.length === 0) {
      this.setDefaultFilterType();
    }
    this.render();
  }
}
