export default class PointsPresenter {
  constructor(api, eventsModel) {
    this._api = api;
    this._enableNewEventButtonHandler = null;
    this._eventsModel = eventsModel;
    this._observers = [];
  }

  collapse() {
    this._observers.forEach((item) => item.setDefaultView());
  }

  collapseAndUnsubscribeAll() {
    if (this._observers.length > 0) {
      this.collapse();
      this._observers = [];
    }
  }

  callEnableNewEventButtonHandler() {
    this._enableNewEventButtonHandler();
  }

  getDestinations() {
    return this._eventsModel.getDestinations();
  }

  getOffers() {
    return this._eventsModel.getOffers();
  }

  getOffersTitleMap() {
    return this._eventsModel.getOffersTitleMap();
  }

  setEnableNewEventButtonHandler(handler) {
    this._enableNewEventButtonHandler = handler;
  }

  subscribe(handler) {
    this._observers.push(handler);
  }

  syncData(eventPresenter, oldData, newData, handler) {
    if (oldData && newData) {
      this._api.updateEvent(oldData.id, newData)
      .then(() => {
        this._eventsModel.updateEvent(oldData.id, newData);
        if (handler) {
          handler();
        }
      })
      .catch(() => {
        eventPresenter.shake();
      });
    } else if (!oldData) {
      this._api.addEvent(newData)
      .then((response) => {
        newData[`id`] = response[`id`];
        this._eventsModel.addEvent(newData);
        if (handler) {
          handler();
        }
      })
      .catch(() => {
        eventPresenter.shake();
      });
    } else {
      this._api.deleteEvent(oldData.id)
      .then(() => {
        this._eventsModel.deleteEvent(oldData.id);
        if (handler) {
          handler();
        }
      })
      .catch(() => {
        eventPresenter.shake();
      });
    }
  }

  syncFavorite(id, event) {
    event[`isFavorite`] = !event[`isFavorite`];
    this._api.updateEvent(id, event)
      .then(() => {
        this._eventsModel.updateFavoriteEvent(id, event[`isFavorite`]);
      });
  }

  unsubscribe(handler) {
    this._observers = this._observers.filter((subscriber) => subscriber !== handler);
  }
}
