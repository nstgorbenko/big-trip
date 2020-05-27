export default class Offer {
  constructor(offer) {
    this.type = offer[`type`];
    this.offers = offer[`offers`];
  }

  static parse(offer) {
    return new Offer(offer);
  }

  static parseAll(offers) {
    return offers.map(Offer.parse);
  }
}
