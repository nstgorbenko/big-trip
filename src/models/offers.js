export default class Offers {
  constructor() {
    this._items = [];
  }

  set(offers) {
    const offersData = Array.from(offers).reduce((resultOffers, offer) => {
      resultOffers[offer.type] = offer.offers;
      return resultOffers;
    }, {});

    this._items = offersData;
  }

  get() {
    return this._items;
  }
}

