import AbstractComponent from '../abstract-component.js';

const createBlankTripTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};

export default class BlankTrip extends AbstractComponent {
  getTemplate() {
    return createBlankTripTemplate();
  }
}

