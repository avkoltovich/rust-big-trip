import AbstractComponent from '../../abstract-component.js';

export default class InfoCost extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    this._totalCost = this._getTotalCost(this._events);

    return (
      `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalCost}</span>
      </p>`
    );
  }

  _getTotalCost(events) {
    const tripTotalCost = events.reduce((total, cost) => {
      const offersTotalPrice = this._countOffersTotalCost(cost.offers);
      return total + cost.basePrice + offersTotalPrice;
    }, 0);
    return tripTotalCost;
  }

  _countOffersTotalCost(offers) {
    const offersTotalCost = offers ? offers.reduce((offersTotal, offerCost) => offersTotal + offerCost.price, 0) : 0;
    return offersTotalCost;
  }
}
