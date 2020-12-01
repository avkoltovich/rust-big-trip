import {render, InsertionPosition} from '../../helpers/render.js';
import {Mode} from '../../helpers/const.js';
import DaysListComponent from './days/days-list.js';
import DayItemBlankComponent from './days/day-blank.js';
import PointsListComponent from './points/points-list.js';
import PointItemComponent from './points/point-item.js';
import PointPresenter from '../../presenters/point.js';

export default class PointsGroupByTimeOrPrice {
  constructor(events, pointsPresenter) {
    this._events = events;
    this._pointsPresenter = pointsPresenter;
    this._element = this._getPointsGroupByTimeOrPrice();

    return this._element;
  }

  _getPointsGroupByTimeOrPrice() {
    const daysListComponent = new DaysListComponent();
    const dayItemComponent = new DayItemBlankComponent();
    render(daysListComponent, dayItemComponent, InsertionPosition.BEFOREEND);

    const pointsListComponent = new PointsListComponent();
    render(dayItemComponent, pointsListComponent, InsertionPosition.BEFOREEND);

    for (const event of this._events) {
      const pointItem = new PointItemComponent();
      render(pointsListComponent, pointItem, InsertionPosition.BEFOREEND);
      const pointPresenter = new PointPresenter(pointItem, event, this._pointsPresenter);
      pointPresenter.render(Mode.VIEW);
    }

    return daysListComponent;
  }
}
