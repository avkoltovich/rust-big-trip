import AbstractComponent from '../abstract-component.js';

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="stats" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();

    this._tableButton = this.getElement().querySelector(`#table`);
    this._statsButton = this.getElement().querySelector(`#stats`);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setTableButtonHandler(handler) {
    this._tableButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (!this._tableButton.classList.contains(`trip-tabs__btn--active`)) {
        this._tableButton.classList.toggle(`trip-tabs__btn--active`);

        if (this._statsButton.classList.contains(`trip-tabs__btn--active`)) {
          this._statsButton.classList.toggle(`trip-tabs__btn--active`);
        }

        handler();
      }
    });
  }

  setStatsButtonHandler(handler) {
    this._statsButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (!this._statsButton.classList.contains(`trip-tabs__btn--active`)) {
        this._statsButton.classList.toggle(`trip-tabs__btn--active`);

        if (this._tableButton.classList.contains(`trip-tabs__btn--active`)) {
          this._tableButton.classList.toggle(`trip-tabs__btn--active`);
        }

        handler();
      }
    });
  }
}
