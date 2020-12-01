import AbstractComponent from '../../abstract-component.js';

const createPointsListTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class PointsList extends AbstractComponent {
  getTemplate() {
    return createPointsListTemplate();
  }
}
