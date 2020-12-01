import {TRANSFER_TYPE, ACTIVITY_TYPES, eventTypesMap} from '../../../helpers/const.js';
import {createOfferCheckboxTemplate} from './offer-template.js';
import {getFormatTime24H, castTimeFormat} from '../../../helpers/utils.js';
import {Mode} from '../../../helpers/const.js';
import AbstractSmartComponent from '../../abstract-smart-component.js';
import flatpickr from 'flatpickr';
import {encode} from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const getStringDate = (date) => `${castTimeFormat(date.getDate())}/${castTimeFormat(date.getMonth())}/${date.getFullYear() % 100}`;

const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const createPointTypeItemTemplate = (type, isChecked, id) => {
  const eventTypeString = capitalizeFirstLetter(type);
  const checked = `${type}" ${isChecked ? `checked` : ``}`;

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${checked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${eventTypeString}</label>
    </div>`
  );
};

const createTypesFieldsetTemplate = (typesList, type, id) => {
  return typesList.map((typeItem) => createPointTypeItemTemplate(typeItem, typeItem === type, id)).join(`\n`);
};

const createDestinationItemTemplate = (city) => {
  return (
    `<option value="${city}"></option>`
  );
};

const createTripPhotoTemplate = (src) => {
  return (
    `<img class="event__photo" src="${src}" alt="Event photo">`
  );
};

const createRollupButton = () => {
  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createDestinationSectionTemplate = (cityDescription, photosTape) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${cityDescription}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${photosTape}
        </div>
      </div>
    </section>`
  );
};

const createOffersSectionTemplate = (offersCheckboxes) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersCheckboxes}
      </div>
    </section>`
  );
};

const createEditablePointTemplate = (destinations, options = {}, mode) => {
  const CITIES = destinations.map((item) => item.name);

  const {placeholder, type, destination, offers, selectedOffers, id, isFavorite, dateFrom, dateTo, basePrice} = options;

  let city = ``;
  let cityDescription = ``;
  let destinationSection = ``;
  let photosTape = ``;
  let offersSection = ``;

  if (destination) {
    city = destination.name;
    cityDescription = destination.description;
    photosTape = destination.pictures.map((picture) => createTripPhotoTemplate(picture.src)).join(`\n`);
    destinationSection = createDestinationSectionTemplate(cityDescription, photosTape);
  }

  if (offers) {
    const offersCheckboxes = offers.map((offer) => createOfferCheckboxTemplate(offer, id, selectedOffers)).join(`\n`);
    offersSection = createOffersSectionTemplate(offersCheckboxes);
  }

  const activityTypesFieldsetItems = createTypesFieldsetTemplate(ACTIVITY_TYPES, type, id);
  const dateFromValue = `${getStringDate(dateFrom)} ${getFormatTime24H(dateFrom)}`;
  const dateToValue = `${getStringDate(dateTo)} ${getFormatTime24H(dateTo)}`;
  const destinationItems = CITIES.map((destinationItem) => createDestinationItemTemplate(destinationItem)).join(`\n`);
  const favorite = `${isFavorite ? `checked` : ``}`;
  const resetButtonName = `${mode === Mode.VIEW ? `Delete` : `Cancel`}`;
  const rollupButton = `${mode === Mode.VIEW ? createRollupButton() : ``}`;
  const transferTypesFieldsetItems = createTypesFieldsetTemplate(TRANSFER_TYPE, type, id);
  const tripEventsItem = `${mode === Mode.VIEW ? `` : `trip-events__item`}`;

  return (
    `<form class="${tripEventsItem} event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferTypesFieldsetItems}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityTypesFieldsetItems}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${placeholder}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${destinationItems}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFromValue}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToValue}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="0" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonName}</button>

          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          ${rollupButton}
        </header>

        <section class="event__details">
          ${offersSection}

          ${destinationSection}
        </section>
      </form>`
  );
};

export default class EditablePoint extends AbstractSmartComponent {
  constructor(event, destinations, offers, offersTitleMap, mode) {
    super();

    this.applyFlatpickr = this.applyFlatpickr.bind(this);
    this.removeFlatpickr = this.removeFlatpickr.bind(this);
    this.subscribeOnEvents = this.subscribeOnEvents.bind(this);

    this._event = event;

    this._allOffers = offers;
    this._basePrice = this._event[`basePrice`];
    this._city = this._event.destination.name;
    this._collapseHandler = null;
    this._dateFrom = this._event[`dateFrom`];
    this._dateTo = this._event[`dateTo`];
    this._deleteButtonClickHandler = null;
    this._destination = this._event.destination;
    this._destinations = destinations;
    this._destinationIndex = this._getDestinationIndex(this._city);
    this._id = this._event.id;
    this._isFavorite = this._event[`isFavorite`];
    this._isValidCity = this._destinationIndex !== -1;
    this._flatpickrEnd = null;
    this._flatpickrStart = null;
    this._mode = mode;
    this._offersTitleMap = offersTitleMap;
    this._selectedOffers = this._event.offers;
    this._submitHandler = null;
    this._type = this._event.type;

    this._allOffersByType = this._getOffersByType(this._type);
    this._placeholder = eventTypesMap[this._type];

    this._isValid();
  }

  applyFlatpickr() {
    const dateStartInput = this.getElement().querySelector(`[name="event-start-time"]`);
    this._flatpickrStart = flatpickr(dateStartInput, {
      enableTime: true,
      altFormat: `d/m/y H:i`,
      altInput: true,
      [`time_24hr`]: true,
      defaultDate: this._dateFrom,
    });

    const dateEndInput = this.getElement().querySelector(`[name="event-end-time"]`);
    this._flatpickrEnd = flatpickr(dateEndInput, {
      enableTime: true,
      altFormat: `d/m/y H:i`,
      altInput: true,
      [`time_24hr`]: true,
      defaultDate: this._dateTo,
    });
  }

  getData() {
    return this._parseFormData();
  }

  getTemplate() {
    return createEditablePointTemplate(this._destinations, {
      basePrice: this._basePrice,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      destination: this._destination,
      id: this._id,
      isFavorite: this._isFavorite,
      offers: this._allOffersByType,
      placeholder: this._placeholder,
      selectedOffers: this._selectedOffers,
      type: this._type
    }, this._mode);
  }

  recoveryListeners() {
    if (this._mode === Mode.VIEW) {
      this.setCollapseHandler(this._collapseHandler);
    }

    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.subscribeOnEvents();
  }

  removeElement() {
    this.removeFlatpickr();
    super.removeElement();
  }

  removeFlatpickr() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }
  }

  rerender() {
    super.rerender();

    this.applyFlatpickr();
  }

  setButtonText(text = {save: `Save`, delete: `Delete`}) {
    this.getElement().querySelector(`.event__save-btn`).textContent = text.save;
    this.getElement().querySelector(`.event__reset-btn`).textContent = text.delete;
  }

  setCollapseHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._collapseHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, (evt) => {
        this._type = evt.target.value;
        this._placeholder = eventTypesMap[this._type];
        this._allOffersByType = this._getOffersByType(this._type);

        this.rerender();
      });

    const destinationInput = element.querySelector(`.event__input--destination`);

    destinationInput.addEventListener(`click`, () => {
      destinationInput.value = ``;
    });

    destinationInput.addEventListener(`input`, (evt) => {
      this._city = evt.target.value;
      this._destinationIndex = this._getDestinationIndex(this._city);
      if (this._destinationIndex !== -1) {
        this._destination = this._destinations[this._destinationIndex];
        this._isValidCity = true;

        this.rerender();
      } else {
        this._isValidCity = false;

        this._isValid();
      }
    });

    element.querySelector(`[name="event-start-time"]`)
    .addEventListener(`change`, (evt) => {
      this._dateFrom = new Date(evt.target.value);

      if (this._dateFrom > this._dateTo) {
        this._flatpickrEnd.setDate(this._dateFrom);
      }
    });

    element.querySelector(`[name="event-end-time"]`)
    .addEventListener(`change`, (evt) => {
      const newDate = new Date(evt.target.value);

      if (newDate > this._dateFrom) {
        this._dateTo = newDate;
      } else {
        this._flatpickrEnd.setDate(this._dateFrom);
      }
    });

    element.querySelector(`.event__input--price`)
    .addEventListener(`change`, (evt) => {
      this._basePrice = +(encode((evt.target.value)));
    });

    element.querySelector(`.event__favorite-checkbox`)
    .addEventListener(`change`, () => {
      this._isFavorite = !this._isFavorite;
    });
  }

  _getDestinationIndex(city) {
    return this._destinations.findIndex((item) => item.name === city);
  }

  _getFavoriteStatus() {
    return (this.getElement().querySelector(`.event__favorite-checkbox:checked`)) ? true : false;
  }

  _getOffersByType(type) {
    const index = this._allOffers.findIndex((item) => item.type === type);

    if (index !== -1) {
      return this._allOffers[index].offers;
    }

    return null;
  }

  _getOffersIndexByTitle(title) {
    return this._allOffersByType.findIndex((item) => item.title === title);
  }

  _getSelectedOffers() {
    const selectedOffers = [];
    const offers = this.getElement().querySelectorAll(`.event__offer-checkbox:checked`);
    offers.forEach((item) => {
      selectedOffers.push(this._allOffersByType[this._getOffersIndexByTitle(this._offersTitleMap[item.name])]);
    });

    return selectedOffers;
  }

  _isValid() {
    this.getElement().querySelector(`.event__save-btn`)
    .disabled = this._isValidCity ? `` : `disabled`;
  }

  _parseFormData() {
    this._selectedOffers = this._getSelectedOffers();
    this._isFavorite = this._getFavoriteStatus();

    if (this._id) {
      this._event[`id`] = this._id;
    }

    this._event[`basePrice`] = this._basePrice;
    this._event[`dateFrom`] = this._dateFrom;
    this._event[`dateTo`] = this._dateTo;
    this._event[`destination`] = this._destination;
    this._event[`isFavorite`] = this._isFavorite;
    this._event[`offers`] = this._selectedOffers;
    this._event[`type`] = this._type;

    return this._event;
  }
}
