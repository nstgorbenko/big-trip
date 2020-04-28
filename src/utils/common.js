const EscapeKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const addZero = (number) => String(number).padStart(2, `0`);

export const isEscEvent = (evt) => evt.key === EscapeKey.ESCAPE || evt.key === EscapeKey.ESC;
