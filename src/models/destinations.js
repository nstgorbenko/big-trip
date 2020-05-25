export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  set(destinations) {
    this._destinations = Array.from(destinations);
  }

  get() {
    return this._destinations;
  }
}
