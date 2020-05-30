export default class Destinations {
  constructor() {
    this._items = [];
  }

  set(destinations) {
    this._items = Array.from(destinations);
  }

  get() {
    return this._items;
  }

  find(destinationName) {
    return this._items.find(({name}) => name === destinationName) || null;
  }
}
