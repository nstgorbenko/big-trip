export default class Destination {
  constructor(destination) {
    this.name = destination[`name`];
    this.description = destination[`description`];
    this.photos = destination[`pictures`];
  }

  convertToRaw() {
    return {
      "name": this.name,
      "description": this.description,
      "pictures": this.photos,
    };
  }

  static parse(destination) {
    return new Destination(destination);
  }

  static parseAll(destinations) {
    return destinations.map(Destination.parse);
  }
}
