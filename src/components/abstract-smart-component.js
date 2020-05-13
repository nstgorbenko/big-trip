import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    super();

    if (new.target === AbstractSmartComponent) {
      throw new Error(`Can't instantiate AbstractSmartComponent, only concrete one.`);
    }
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    oldElement.replaceWith(this.getElement());

    this.recoveryListeners();
  }
}
