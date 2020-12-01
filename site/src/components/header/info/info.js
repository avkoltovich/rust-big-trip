import AbstractComponent from '../../abstract-component.js';

const createInfoTemplate = (infoRoute, infoCost) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${infoRoute}
      </div>

      ${infoCost}
    </section>`
  );
};

export default class Info extends AbstractComponent {
  constructor(infoRoute, infoCost) {
    super();

    this._infoCost = infoCost;
    this._infoRoute = infoRoute;
  }

  getTemplate() {
    return createInfoTemplate(this._infoRoute, this._infoCost);
  }
}
