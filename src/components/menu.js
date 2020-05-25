import AbstractComponent from "./abstract-component.js";
import {MenuItem} from "../const.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A` || evt.target.classList.contains(ACTIVE_CLASS)) {
        return;
      }

      this._setActiveItem(evt.target);
      const menuItem = evt.target.dataset.menuItem;
      handler(menuItem);
    });
  }

  _setActiveItem(newItem) {
    const lastActiveItem = this.getElement().querySelector(`.${ACTIVE_CLASS}`);
    lastActiveItem.classList.remove(ACTIVE_CLASS);
    newItem.classList.add(ACTIVE_CLASS);
  }
}
