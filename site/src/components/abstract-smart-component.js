import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const className = oldElement.className;
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();
    newElement.className = className;

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
