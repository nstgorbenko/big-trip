import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const createFilterMarkup = ({name, count}, isChecked) => {
  const isActive = count > 0;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``} ${isActive ? `` : `disabled`}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) =>
    createFilterMarkup(filter, filter.checked)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};


export default class Filter extends AbstractComponent {
  constructor(filters = [], activeFilter = FilterType.ALL) {
    super();

    this._filters = filters;
    this._activeType = activeFilter;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getActiveType() {
    return this._activeType;
  }

  setDefault() {
    this._activeType = FilterType.ALL;
    this.getElement().querySelector(`#filter-${FilterType.ALL}`).checked = true;
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      this._activeType = evt.target.value;
      handler(evt.target.value);
    });
  }
}
