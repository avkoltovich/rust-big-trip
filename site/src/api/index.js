import EventAdapter from '../models/event-adapter.js';

const STATUS_REDIRECTION = 300;
const STATUS_OK = 200;

const ServerUrl = {
  DESTINATIONS: `https://11.ecmascript.pages.academy/big-trip/destinations`,
  OFFERS: `https://11.ecmascript.pages.academy/big-trip/offers`,
  POINTS: `https://11.ecmascript.pages.academy/big-trip/points`,
  SYNC: `https://11.ecmascript.pages.academy/big-trip/points/sync`
};

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getData() {
    return Promise.all([
      this._getEvents(),
      this._getOffers(),
      this._getDestinations(),
    ])
      .then((response) => {
        const [events, offers, destinations] = response;
        return {
          events,
          offers,
          destinations,
        };
      });
  }

  addEvent(event) {
    return this._sendRequest({
      url: ServerUrl.POINTS,
      method: `POST`,
      body: JSON.stringify(event.toRAW()),
    })
      .then((response) => response.json())
      .then(EventAdapter.parseTripEvent);
  }

  deleteEvent(id) {
    return this._sendRequest({
      url: `${ServerUrl.POINTS}/${id}`,
      method: `DELETE`,
    });
  }

  sync(localEvents) {
    return this._sendRequest({
      url: `${ServerUrl.SYNC}`,
      method: `POST`,
      body: JSON.stringify(localEvents),
    })
      .then((response) => response.json());
  }

  updateEvent(id, event) {
    return this._sendRequest({
      url: `${ServerUrl.POINTS}/${id}`,
      method: `PUT`,
      body: JSON.stringify(event.toRAW()),
    })
    .then(this._checkStatus)
    .then((response) => response.json())
    .then(EventAdapter.parseTripEvent);
  }

  _checkStatus(response) {
    if (response.status >= STATUS_OK && response.status < STATUS_REDIRECTION) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  _getEvents() {
    return this._sendRequest({url: ServerUrl.POINTS})
      .then((response) => response.json())
      .then(EventAdapter.parseEvents);
  }

  _getDestinations() {
    return this._sendRequest({url: ServerUrl.DESTINATIONS})
      .then((response) => response.json());
  }

  _getOffers() {
    return this._sendRequest({url: ServerUrl.OFFERS})
      .then((response) => response.json());
  }

  _sendRequest({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return fetch(url, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
