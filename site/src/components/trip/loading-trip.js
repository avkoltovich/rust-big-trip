import AbstractComponent from '../abstract-component.js';

const createLoadingTripTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class LoadingTrip extends AbstractComponent {
  getTemplate() {
    return createLoadingTripTemplate();
  }
}
