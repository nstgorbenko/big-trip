import AbstractComponent from "./abstract-component.js";

const createNewEventTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewEvent extends AbstractComponent {
  getTemplate() {
    return createNewEventTemplate();
  }

  setDisabledState(value) {
    this.getElement().disabled = value;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
