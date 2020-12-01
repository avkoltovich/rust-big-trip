import AbstractComponent from '../../abstract-component.js';

const createPointItemTemplate = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class PointItem extends AbstractComponent {
  getTemplate() {
    return createPointItemTemplate();
  }
}
