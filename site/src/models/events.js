import {filterTypeMap, sortTypeMap} from '../helpers/const.js';
import {getCebabName} from '../helpers/utils.js';

export default class Events {
  constructor() {
    this._activeFilterType = filterTypeMap.DEFAULT;
    this._activeSortType = sortTypeMap.DEFAULT;
    this._destinations = [];
    this._events = [];
    this._filteredAndSortedEvents = [];
    this._offers = [];
    this._offersTitleMap = {};

    this._dataChangeHandlers = [];
    this._filterHandlers = [];
    this._sortHandlers = [];
  }

  addEvent(event) {
    this._events.push(event);
    this._events = this._getSortedEvents(this._events);

    this._callHandlers(this._dataChangeHandlers);
  }

  deleteEvent(id) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), this._events.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  getAllEvents() {
    return this._events;
  }

  getDestinations() {
    return this._destinations;
  }

  getEvents() {
    this._filteredAndSortedEvents = this._getSortedEvents(this._getFilteredEvents(this._events));
    return this._filteredAndSortedEvents;
  }

  getOffers() {
    return this._offers;
  }

  getOffersTitleMap() {
    return this._offersTitleMap;
  }

  getSortType() {
    return this._activeSortType;
  }

  resetFilterType() {
    this._activeFilterType = filterTypeMap.DEFAULT;
    this._resetSortType();
    this._callHandlers(this._filterHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  setEvents(events) {
    this._events = Array.from(events);
    this._events = this._getSortedEventsByDays(this._events);
  }

  setFilterHandlers(handler) {
    this._filterHandlers.push(handler);
  }

  setFilterType(filterType) {
    this._resetSortType();
    this._activeFilterType = filterType;
    this._callHandlers(this._filterHandlers);
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
    this._offers.map((items) => {
      items.offers.map((offer) => {
        this._offersTitleMap[getCebabName(offer.title)] = offer.title;
      });
    });
  }

  setSortHandlers(handler) {
    this._sortHandlers.push(handler);
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
    this._callHandlers(this._sortHandlers);
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._events.splice(index, 1);
    this._events.push(event);

    this._events = this._getSortedEventsByDays(this._events);

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updateFavoriteEvent(id, isFavorite) {
    const index = this._events.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this._events[index][`isFavorite`] = isFavorite;

    return true;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getFilteredEvents(events) {
    const nowDate = new Date();
    const index = this._events.findIndex((item) => item[`dateFrom`] > nowDate);
    let filteredEvents = [];

    switch (this._activeFilterType) {
      default:
        filteredEvents = events.slice();
        break;
      case filterTypeMap.FUTURE:
        filteredEvents = events.slice(index);
        break;
      case filterTypeMap.PAST:
        filteredEvents = events.slice(0, index);
        break;
    }

    return filteredEvents;
  }

  _getSortedEvents(events) {
    let sortedEvents = events.slice();

    switch (this._activeSortType) {
      default:
        sortedEvents = this._getSortedEventsByDays(events);
        break;
      case sortTypeMap.TIME:
        sortedEvents.sort((a, b) => (b[`dateTo`] - b[`dateFrom`]) - (a[`dateTo`] - a[`dateFrom`]));
        break;
      case sortTypeMap.PRICE:
        sortedEvents.sort((a, b) => b[`basePrice`] - a[`basePrice`]);
        break;
    }

    return sortedEvents;
  }

  _getSortedEventsByDays(events) {
    return events.slice().sort((a, b) => a[`dateFrom`] - b[`dateFrom`]);
  }

  _resetSortType() {
    this._activeSortType = sortTypeMap.DEFAULT;
  }
}
