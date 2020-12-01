import AbstractComponent from '../../abstract-component.js';

const createDayItemBlankTemplate = () => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
      </div>
    </li>`
  );
};

export default class DayBlankItem extends AbstractComponent {
  getTemplate() {
    return createDayItemBlankTemplate();
  }
}
