import {render, InsertionPosition} from '../../helpers/render.js';
import {getISOStringDate} from '../../helpers/utils.js';
import {Mode} from '../../helpers/const.js';
import DayItemComponent from './days/day.js';
import DaysListComponent from './days/days-list.js';
import PointsListComponent from './points/points-list.js';
import PointItemComponent from './points/point-item.js';
import PointPresenter from '../../presenters/point.js';

export default class PointsGroupByDays {
  constructor(events, pointsPresenter) {
    this._events = events;
    this._pointsPresenter = pointsPresenter;
    this._element = this._getPointsGroupByDays();

    return this._element;
  }

  _getPassedDays(start, end) {
    return (new Date(new Date(end) - new Date(start))).getDate();
  }

  _getPointsGroupByDays() {
    const daysListComponent = new DaysListComponent();
    let daysPassed;
    let startDateTime;
    let previousDateTime;
    let currentPointsListElement;

    for (const event of this._events) {
      const currentDateTime = getISOStringDate(event[`dateFrom`]).slice(0, 10);

      if (previousDateTime === currentDateTime) {
        const pointItem = new PointItemComponent();
        render(currentPointsListElement, pointItem, InsertionPosition.BEFOREEND);
        const pointPresenter = new PointPresenter(pointItem, event, this._pointsPresenter);
        pointPresenter.render(Mode.VIEW);
      } else {
        startDateTime = startDateTime ? startDateTime : currentDateTime;
        daysPassed = daysPassed ? this._getPassedDays(startDateTime, currentDateTime) : 1;

        const currentDayItemElement = new DayItemComponent(event, daysPassed);
        render(daysListComponent, currentDayItemElement, InsertionPosition.BEFOREEND);

        currentPointsListElement = new PointsListComponent();
        render(currentDayItemElement, currentPointsListElement, InsertionPosition.BEFOREEND);
        const pointItem = new PointItemComponent();
        render(currentPointsListElement, pointItem, InsertionPosition.BEFOREEND);
        const pointPresenter = new PointPresenter(pointItem, event, this._pointsPresenter);
        pointPresenter.render(Mode.VIEW);

        previousDateTime = currentDateTime;
      }
    }

    return daysListComponent;
  }
}
