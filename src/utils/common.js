const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const addZero = (number) => String(number).padStart(2, `0`);

export const isEscKey = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;
