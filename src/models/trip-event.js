const renameObjectProperty = (object, previousKey, requiredKey) => {
  const correctObject = Object.assign({}, object);
  correctObject[requiredKey] = object[previousKey];
  delete correctObject[previousKey];

  return correctObject;
};

export default class TripEvent {
  constructor(tripEvent) {
    this.id = tripEvent[`id`];
    this.type = tripEvent[`type`];
    this.destination = renameObjectProperty(tripEvent[`destination`], `pictures`, `photos`);
    this.start = new Date(tripEvent[`date_from`]);
    this.end = new Date(tripEvent[`date_to`]);
    this.basePrice = tripEvent[`base_price`];
    this.offers = tripEvent[`offers`];
    this.isFavorite = Boolean(tripEvent[`is_favorite`]);
  }

  convertToRaw() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": renameObjectProperty(this.destination, `photos`, `pictures`),
      "date_from": this.start,
      "date_to": this.end,
      "base_price": this.basePrice,
      "offers": this.offers,
      "is_favorite": this.isFavorite
    };
  }

  static parse(tripEvent) {
    return new TripEvent(tripEvent);
  }

  static parseAll(tripEvents) {
    return tripEvents.map(TripEvent.parse);
  }
}
