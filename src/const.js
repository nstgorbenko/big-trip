export const ActionType = {
  TO_VIEW: `TO_VIEW`,
  TO_EDIT: `TO_EDIT`,
  ADD_TO_FAVORITE: `ADD_TO_FAVORITE`
};

export const eventGroups = {
  'Transfer': [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  'Activity': [`Check-in`, `Sightseeing`, `Restaurant`],
};

export const eventTypesWithPrepositions = {
  'Taxi': `Taxi to`,
  'Bus': `Bus to`,
  'Train': `Train to`,
  'Ship': `Ship to`,
  'Transport': `Transport to`,
  'Drive': `Drive to`,
  'Flight': `Flight to`,
  'Check-in': `Check-in in`,
  'Sightseeing': `Sightseeing in`,
  'Restaurant': `Restaurant in`,
};

export const Message = {
  NO_EVENTS: `Click New Event to create your first point`,
  LOADING: `Loading...`
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};
