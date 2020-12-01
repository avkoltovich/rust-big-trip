import EventAdapter from '../models/event-adapter.js';
import {keyMap} from '../helpers/const.js';
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, store, eventsModel) {
    this._api = api;
    this._store = store;
    this._eventsModel = eventsModel;
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.updateItem(newEvent.id, newEvent);

          return newEvent;
        });
    }

    event.id = nanoid();

    this._store.updateItem(event.id, event.toRAW());
    return Promise.resolve(event);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }

  getData() {
    if (isOnline()) {
      return this._api.getData()
        .then((response) => {
          const events = createStoreStructure(response.events.map((event) => event.toRAW()));

          this._store.setItems(keyMap.OFFERS, response.offers);
          this._store.setItems(keyMap.DESTINATIONS, response.destinations);
          this._store.setItems(keyMap.EVENTS, events);

          return response;
        });
    }

    return Promise.resolve(Object.assign({},
        {events: this._store.getItems(keyMap.EVENTS)},
        {destinations: this._store.getItems(keyMap.DESTINATIONS)},
        {offers: this._store.getItems(keyMap.OFFERS)}));
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems(keyMap.EVENTS));

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(keyMap.EVENTS, items);

          const syncedItems = EventAdapter.parseEvents(Object.values(items));
          this._eventsModel.setEvents(syncedItems);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  updateEvent(id, event) {
    if (isOnline()) {
      return this._api.updateEvent(id, event)
      .then((updatedEvent) => {
        this._store.updateItem(updatedEvent.id, updatedEvent);

        return updatedEvent;
      });
    }

    this._store.updateItem(id, event.toRAW());

    return Promise.resolve(event);
  }
}
