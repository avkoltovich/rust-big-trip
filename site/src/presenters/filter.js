import FilterComponent from '../components/header/filter.js';
import {InsertionPosition, render} from '../helpers/render.js';

export default class FilterPresenter {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filterComponent = new FilterComponent();
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  render() {
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    render(this._container, this._filterComponent, InsertionPosition.BEFOREEND);
  }

  reset() {
    this._eventsModel.resetFilterType();
    this._filterComponent.rerender();
  }

  _filterTypeChangeHandler(filterType) {
    this._eventsModel.setFilterType(filterType);
  }
}
