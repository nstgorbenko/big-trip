import {createElement} from "../utils/dom.js";
import {HIDDEN_CLASS} from "../const.js";

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate ${new.target.name}, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate.`);
  }

  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  hide() {
    this.getElement().classList.add(HIDDEN_CLASS);
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this.getElement().classList.remove(HIDDEN_CLASS);
  }
}
