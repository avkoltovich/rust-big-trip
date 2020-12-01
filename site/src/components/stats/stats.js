import AbstractComponent from '../abstract-component.js';
import {TRANSFER_TYPE} from '../../helpers/const.js';

import {moneyChart} from './charts/money-сhart.js';
import {transportChart} from './charts/transport-chart.js';
import {timeSpendChart} from './charts/time-spend-chart.js';

import Moment from 'moment';

const chartTypeMap = {
  transport: TRANSFER_TYPE,
  timeSpend: `time spend`,
  money: `money`
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractComponent {
  constructor(eventsModel) {
    super();
    this._eventsModel = eventsModel;

    this._events = null;
    this._moneyChart = null;
    this._timeSpendChart = null;
    this._transportChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  remove() {
    this.getElement().remove();
  }

  render() {
    this._renderCharts();
  }

  _getMoneyCountByType(events) {
    return events.reduce((sum, event) => {
      sum[event.type] = (sum[event.type] || 0) + event.basePrice;
      return sum;
    }, {});
  }

  _getTimeSpendCountByType(events) {
    return events.reduce((time, event) => {
      const dateFrom = new Moment(event.dateFrom);
      const dateTo = new Moment(event.dateTo);
      const diff = Moment.duration(dateTo.diff(dateFrom)).hours();

      time[event.type] = (time[event.type] || 0) + diff;
      return time;
    }, {});
  }

  _getTransportCountByType(events, type) {
    return events.filter((event) => type.includes(event.type))
    .reduce((count, event) => {
      count[event.type] = (count[event.type] || 0) + 1;
      return count;
    }, {});
  }

  _getSortedDataByChartType(type) {
    let dataByType = {};
    this._events = this._eventsModel.getAllEvents();

    switch (type) {
      case chartTypeMap.transport:
        dataByType = this._getTransportCountByType(this._events, type);
        break;
      case chartTypeMap.timeSpend:
        dataByType = this._getTimeSpendCountByType(this._events);
        break;
      case chartTypeMap.money:
        dataByType = this._getMoneyCountByType(this._events);
        break;
    }

    return Object.fromEntries(Object.entries(dataByType).sort((a, b) => b[1] - a[1]));
  }

  _renderCharts() {
    const element = this.getElement();
    const ctxMoney = element.querySelector(`.statistics__chart--money`);
    const ctxTransport = element.querySelector(`.statistics__chart--transport`);
    const ctxTimeSpend = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();
    this._moneyChart = moneyChart(ctxMoney, this._getSortedDataByChartType(chartTypeMap.money));
    this._transportChart = transportChart(ctxTransport, this._getSortedDataByChartType(chartTypeMap.transport));
    this._timeSpendChart = timeSpendChart(ctxTimeSpend, this._getSortedDataByChartType(chartTypeMap.timeSpend));
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
