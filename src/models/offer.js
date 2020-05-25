export default class Offer {
  constructor(offer) {
    this[offer[`type`]] = offer[`offers`];
  }

  static parse(offer) {
    return new Offer(offer);
  }

  static parseAll(offers) {
    return offers.map(Offer.parse);
  }
}
