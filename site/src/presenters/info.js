import InfoComponent from '../components/header/info/info.js';
import InfoCostComponent from '../components/header/info/info-cost.js';
import InfoRouteComponent from '../components/header/info/info-route.js';
import {InsertionPosition, render} from '../helpers/render.js';

export default class MenuPresenter {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._events = null;
    this._infoComponent = null;
    this._infoCostComponent = null;
    this._infoRouteComponent = null;

    this._onDataChangeHandler = this._onDataChangeHandler.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChangeHandler);
  }

  render() {
    this._events = this._eventsModel.getEvents();
    this._infoCostComponent = new InfoCostComponent(this._events);
    this._infoRouteComponent = new InfoRouteComponent(this._events);

    this._infoComponent = new InfoComponent(this._infoRouteComponent.getTemplate(), this._infoCostComponent.getTemplate());

    render(this._container, this._infoComponent, InsertionPosition.AFTERBEGIN);
  }

  _rerender() {
    this._infoComponent.getElement().remove();

    this.render();
  }

  _onDataChangeHandler() {
    this._rerender();
  }
}
