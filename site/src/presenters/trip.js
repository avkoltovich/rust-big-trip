import {Mode, sortTypeMap} from '../helpers/const.js';
import {render, replace, InsertionPosition} from '../helpers/render.js';
import SortingComponent from '../components/sorting.js';
import BlankTripComponent from '../components/trip/blank-trip.js';
import EventAdapter from '../models/event-adapter.js';
import LoadingTripComponent from '../components/trip/loading-trip';
import EventsGroupByDaysComponent from '../components/trip/points-group-by-days.js';
import EventsGroupByTimeOrPriceComponent from '../components/trip/points-group-by-time-or-price.js';
import PointsPresenter from './points.js';
import PointPresenter from './point.js';

const emptyEvent = {
  'base_price': 0,
  'date_from': new Date(),
  'date_to': new Date(),
  'destination': ``,
  'id': null,
  'is_favorite': false,
  'offers': null,
  'type': `taxi`
};

export default class TripPresenter {
  constructor(container, api, eventsModel) {
    this._api = api;
    this._blankTripComponent = new BlankTripComponent();
    this._container = container;
    this._events = null;
    this._eventsModel = eventsModel;
    this._enableNewEventButtonHandler = null;
    this._loadingTripComponent = new LoadingTripComponent();
    this._newPointPresenter = null;
    this._pointsPresenter = new PointsPresenter(this._api, this._eventsModel);
    this._sortingComponent = new SortingComponent();
    this._tripElement = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this.newEvent = this.newEvent.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
    this._eventsModel.setFilterHandlers(this._onFilterChange);
    this._eventsModel.setSortHandlers(this._onSortChange);

    this._pointsPresenter.setEnableNewEventButtonHandler(this._enableNewEventButtonHandler);

  }

  getLoadingMessage() {
    render(this._container, this._loadingTripComponent, InsertionPosition.BEFOREEND);
  }

  newEvent() {
    if (this._tripElement) {
      this._newPointPresenter = new PointPresenter(this._sortingComponent, new EventAdapter(emptyEvent), this._pointsPresenter);
      this._newPointPresenter.render(Mode.CREATE);
    } else {
      this._blankTripComponent.getElement().remove();
      this._newPointPresenter = new PointPresenter(this._container, new EventAdapter(emptyEvent), this._pointsPresenter);
      this._newPointPresenter.render(Mode.CREATE);
    }
  }

  remove() {
    if (this._tripElement) {
      this._sortingComponent.getElement().remove();
      this._tripElement.getElement().remove();
    } else {
      this._blankTripComponent.getElement().remove();
    }
  }

  render() {
    if (this._loadingTripComponent) {
      this._loadingTripComponent.getElement().remove();
      this._loadingTripComponent = null;
    }

    this._events = this._eventsModel.getEvents();

    if (this._events.length === 0) {
      render(this._container, this._blankTripComponent, InsertionPosition.BEFOREEND);
      return;
    }

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      this._eventsModel.setSortType(sortType);
    });

    render(this._container, this._sortingComponent, InsertionPosition.BEFOREEND);

    this._tripElement = this._getTripElement(this._eventsModel.getSortType());
    render(this._container, this._tripElement, InsertionPosition.BEFOREEND);
  }

  rerender() {
    this._onDataChange();
    this.render();
  }

  setEnableNewEventButtonHandler(handler) {
    this._enableNewEventButtonHandler = handler;
    this._pointsPresenter.setEnableNewEventButtonHandler(this._enableNewEventButtonHandler);
  }

  _getTripElement(sortType) {
    this._events = this._eventsModel.getEvents();

    if (sortType === sortTypeMap.DEFAULT) {
      return new EventsGroupByDaysComponent(this._events, this._pointsPresenter);
    }

    return new EventsGroupByTimeOrPriceComponent(this._events, this._pointsPresenter);
  }

  _onDataChange() {
    this._events = this._eventsModel.getEvents();

    if (this._events.length === 0) {
      this.remove();
      this._tripElement = null;
      render(this._container, this._blankTripComponent, InsertionPosition.BEFOREEND);
      return;
    }

    if (this._tripElement) {
      this._onSortChange();
    } else {
      this._enableNewEventButtonHandler();
      this.render();
    }
  }

  _onFilterChange() {
    if (this._tripElement) {
      const sortingComponent = new SortingComponent();
      replace(sortingComponent, this._sortingComponent);
      this._sortingComponent = sortingComponent;

      this._sortingComponent.setSortTypeChangeHandler((sortType) => {
        this._eventsModel.setSortType(sortType);
      });

      this._onSortChange();
    }
  }

  _onSortChange() {
    if (this._enableNewEventButtonHandler) {
      this._enableNewEventButtonHandler();
    }

    if (this._newPointPresenter) {
      this._pointsPresenter.collapseAndUnsubscribeAll();
      this._newPointPresenter.remove();
      this._newPointPresenter = null;
    }

    const filteredAndSortedTripElement = this._getTripElement(this._eventsModel.getSortType());
    replace(filteredAndSortedTripElement, this._tripElement);
    this._tripElement = filteredAndSortedTripElement;
  }
}
