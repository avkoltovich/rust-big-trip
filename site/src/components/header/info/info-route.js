import moment from 'moment';
import AbstractComponent from '../../abstract-component.js';

const MAXIMUM_CITIES_SHOWN = 3;

export default class InfoRoute extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    const title = this._getTripTitle();
    let tripDates = ``;

    if (this._events.length > 0) {
      tripDates = this._getTripDatesTitle(this._events[0][`dateFrom`], this._events[this._events.length - 1][`dateTo`]);
    }

    return `<div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>
              <p class="trip-info__dates">${tripDates}</p>
            </div>`;
  }

  _getTripTitle() {
    const routeCities = Array.from(new Set(this._events.map((event) => event.destination.name)));

    return routeCities.length <= MAXIMUM_CITIES_SHOWN ? routeCities.join(` — `) : routeCities.slice(0, 1) + ` — … — ` + routeCities.slice(routeCities.length - 1);
  }


  _getTripDatesTitle(startDate, endDate) {
    if (moment(startDate).format(`MMM`) === moment(endDate).format(`MMM`)) {
      return `${moment(startDate).format(`MMM D`)} &nbsp;&mdash;&nbsp; ${moment(endDate).format(`D`)}`;
    }

    return `${moment(startDate).format(`MMM D`)} &nbsp;&mdash;&nbsp; ${moment(endDate).format(`MMM D`)}`;
  }
}
