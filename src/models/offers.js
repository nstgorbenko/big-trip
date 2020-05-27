export default class Offers {
  constructor() {
    this._offers = [];
  }

  set(offers) {
    const offersData = Array.from(offers).reduce((resultOffers, offer) => {
      resultOffers[offer.type] = offer.offers;
      return resultOffers;
    }, {});

    this._offers = offersData;
  }

  get() {
    return this._offers;
  }
}

