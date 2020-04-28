import {RenderPosition} from "../const.js";

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(component.getElement());
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      container.after(component.getElement());
      break;
    default:
      throw new Error(`Unknown render position: ${place}`);
  }
};

const replace = (newComponent, oldComponent) => {
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();
  const parentElement = oldElement.parentElement;
  const isElementsExist = !!(newElement && oldElement && parentElement);

  if (isElementsExist) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export {createElement, render, replace};
