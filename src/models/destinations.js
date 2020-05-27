export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  find(destinationName) {
    return this._destinations.find(({name}) => name === destinationName) || null;
  }

  set(destinations) {
    this._destinations = Array.from(destinations);
  }

  get() {
    return this._destinations;
  }
}
