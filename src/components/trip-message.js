import AbstractComponent from "./abstract-component.js";

const createTripMessageTemplate = (message) => {
  return (
    `<p class="trip-events__msg">${message}</p>`
  );
};


export default class TripMessage extends AbstractComponent {
  constructor(message = ``) {
    super();

    this._text = message;
  }

  getTemplate() {
    return createTripMessageTemplate(this._text);
  }
}
