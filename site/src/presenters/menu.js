import MenuComponent from '../components/header/menu.js';
import {InsertionPosition, render} from '../helpers/render.js';

export default class MenuPresenter {
  constructor(container) {
    this._container = container;
    this._menuComponent = new MenuComponent();
  }

  render() {
    render(this._container, this._menuComponent, InsertionPosition.AFTEREND);
  }

  setTableButtonHandler(handler) {
    this._menuComponent.setTableButtonHandler(handler);
  }

  setStatsButtonHandler(handler) {
    this._menuComponent.setStatsButtonHandler(handler);
  }
}
