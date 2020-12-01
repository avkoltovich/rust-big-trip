import moment from 'moment';

export default class EventAdapter {
  constructor(data) {
    this.basePrice = data[`base_price`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.id = data[`id`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': moment.parseZone(this.dateFrom).utc().format(),
      'date_to': moment.parseZone(this.dateTo).utc().format(),
      'is_favorite': this.isFavorite,
      'base_price': this.basePrice,
      'offers': this.offers,
      'destination': this.destination,
    };
  }

  static parseEvent(data) {
    return new EventAdapter(data);
  }

  static parseEvents(data) {
    return data.map(EventAdapter.parseEvent);
  }
}
