export const ActionType = {
  ADD_TO_FAVORITE: `ADD_TO_FAVORITE`,
  DELETE: `DELETE`,
  REMOVE_NEW_EVENT: `REMOVE_NEW_EVENT`,
  TO_EDIT: `TO_EDIT`,
  UPDATE: `UPDATE`,
};

export const EmptyEvent = {
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  start: new Date(),
  end: new Date(),
  basePrice: ``,
  offers: [],
  isFavorite: false,
};

export const FilterType = {
  ALL: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export const Message = {
  NO_EVENTS: `Click New Event to create your first point`,
  LOADING: `Loading...`
};

export const Mode = {
  ADD: `add`,
  FIRST: `first`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};

export const TRANSFER_EVENTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
