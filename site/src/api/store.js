import {keyMap} from '../helpers/const.js';

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey + key)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(key, items) {
    this._storage.setItem(
        key = this._storeKey + key,
        JSON.stringify(items)
    );
  }

  removeItem(id) {
    const store = this.getItems(keyMap.EVENTS);

    delete store[id];

    this._storage.setItem(
        this._storeKey + keyMap.EVENTS,
        JSON.stringify(store)
    );
  }

  updateItem(id, value) {
    const store = this.getItems(keyMap.EVENTS);

    this._storage.setItem(
        this._storeKey + keyMap.EVENTS,
        JSON.stringify(
            Object.assign({}, store, {
              [id]: value
            })
        )
    );
  }
}
