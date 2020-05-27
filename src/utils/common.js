const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const addZero = (number) => String(number).padStart(2, `0`);

export const createNewEvent = () => ({
  type: `bus`,
  destination: {
    name: ``,
    description: ``,
    photos: [],
  },
  start: new Date(),
  end: new Date(),
  basePrice: 0,
  offers: [],
  isFavorite: false
});

export const isEscKey = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;
