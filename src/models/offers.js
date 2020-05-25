export default class Offers {
  constructor() {
    this._offers = [];
  }

  set(offers) {
    const offersData = Array.from(offers).reduce((resultOffers, offer) => {
      const offerKey = Object.keys(offer)[0];
      resultOffers[offerKey] = offer[offerKey];

      return resultOffers;
    }, {});
    this._offers = offersData;
  }

  get() {
    return this._offers;
  }
}

