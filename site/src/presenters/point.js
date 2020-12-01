import {render, replace, InsertionPosition} from '../helpers/render.js';
import {Mode} from '../helpers/const.js';
import CollapsedPointComponent from '../components/trip/points/collapsed-point.js';
import EditablePointComponent from '../components/trip/points/editable-point.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointPresenter {
  constructor(container, event, pointsPresenter) {
    this._container = container;
    this._collapsedPointComponent = null;
    this._editablePointComponent = null;
    this._event = event;
    this._mode = Mode.VIEW;
    this._pointsPresenter = pointsPresenter;

    this._destinations = this._pointsPresenter.getDestinations();
    this._offers = this._pointsPresenter.getOffers();
    this._offersTitleMap = this._pointsPresenter.getOffersTitleMap();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onEscKeyDownNewEvent = this._onEscKeyDownNewEvent.bind(this);
    this.setDefaultView = this.setDefaultView.bind(this);
  }

  remove() {
    if (this._editablePointComponent) {
      this._editablePointComponent.getElement().remove();
      this._editablePointComponent = null;
    }
  }

  render(mode) {
    this._mode = mode;

    if (this._mode === Mode.VIEW) {
      this._collapsedPointComponent = new CollapsedPointComponent(this._event, this._offers);
      this._editablePointComponent = new EditablePointComponent(this._event, this._destinations, this._offers, this._offersTitleMap, this._mode);

      this._collapsedPointComponent.setEditButtonClickHandler(() => {
        this._replaceEventToEdit();
      });

      this._editablePointComponent.setSubmitHandler((evt) => {
        evt.preventDefault();
        this._editablePointComponent.getElement().style.border = `0`;
        this._disableFormElements();
        this._editablePointComponent.setButtonText({
          save: `Saving...`,
          delete: `Delete`
        });
        const data = this._editablePointComponent.getData();
        this._pointsPresenter.syncData(this, this._event, data);
      });

      this._editablePointComponent.setCollapseHandler(() => {
        this._replaceEditToEvent();
      });

      this._editablePointComponent.setDeleteButtonClickHandler(() => {
        this._disableFormElements();
        this._resetBorderStyle();
        this._editablePointComponent.setButtonText({
          save: `Save`,
          delete: `Deleting...`
        });
        this._pointsPresenter.syncData(this, this._event, null);
      });

      this._editablePointComponent.setFavoritesButtonClickHandler(() => {
        this._pointsPresenter.syncFavorite(this._event.id, this._event);
      });

      render(this._container, this._collapsedPointComponent, InsertionPosition.BEFOREEND);
    } else {
      this._addNewEvent();

      render(this._container, this._editablePointComponent, InsertionPosition.AFTEREND);
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._replaceEditToEvent();
    }

    if (this._mode === Mode.CREATE) {
      this._deleteAddNewEventForm();
    }
  }

  shake() {
    this._editablePointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._editablePointComponent.getElement().style.border = `2px solid red`;

    setTimeout(() => {
      this._editablePointComponent.getElement().style.animation = ``;

      this._editablePointComponent.setButtonText({
        save: `Save`,
        delete: `Delete`,
      });

      this._enableFormElements();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addNewEvent() {
    this._editablePointComponent = new EditablePointComponent(this._event, this._destinations, this._offers, this._offersTitleMap, this._mode);
    this._editablePointComponent.applyFlatpickr();
    this._editablePointComponent.subscribeOnEvents();

    this._editablePointComponent.setDeleteButtonClickHandler(() => {
      this._deleteAddNewEventForm();
    });

    this._editablePointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._resetBorderStyle();
      this._disableFormElements();
      this._editablePointComponent.setButtonText({
        save: `Saving...`,
        delete: `Cancel`,
      });
      const data = this._editablePointComponent.getData();
      const removeFlatpickr = this._editablePointComponent.removeFlatpickr.bind(this);
      const editablePointComponent = this._editablePointComponent.getElement();
      this._pointsPresenter.syncData(this, null, data, () => {
        removeFlatpickr();
        editablePointComponent.remove();
        this._pointsPresenter.unsubscribe(this);
      });
    });

    this._pointsPresenter.subscribe(this);

    document.addEventListener(`keydown`, this._onEscKeyDownNewEvent);
  }

  _deleteAddNewEventForm() {
    this._editablePointComponent.removeFlatpickr();
    this._editablePointComponent.getElement().remove();
    this._pointsPresenter.unsubscribe(this);
    this._pointsPresenter.callEnableNewEventButtonHandler();
    document.removeEventListener(`keydown`, this._onEscKeyDownNewEvent);
  }

  _disableFormElements() {
    this._editablePointComponent.getElement()
      .querySelectorAll(`button, input`).forEach((item) => {
        item.disabled = `disabled`;
      });
  }

  _enableFormElements() {
    this._editablePointComponent.getElement()
      .querySelectorAll(`button, input`).forEach((item) => {
        item.disabled = ``;
      });
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _onEscKeyDownNewEvent(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._deleteAddNewEventForm();
    }
  }

  _replaceEditToEvent() {
    replace(this._collapsedPointComponent, this._editablePointComponent);
    this._editablePointComponent.removeFlatpickr();
    this._mode = Mode.VIEW;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointsPresenter.unsubscribe(this);
  }

  _replaceEventToEdit() {
    this._pointsPresenter.collapse();
    replace(this._editablePointComponent, this._collapsedPointComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._pointsPresenter.subscribe(this);
    this._editablePointComponent.applyFlatpickr();
    this._editablePointComponent.subscribeOnEvents();
  }

  _resetBorderStyle() {
    this._editablePointComponent.getElement().style.border = `0`;
  }
}
