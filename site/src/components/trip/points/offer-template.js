import {getCebabName} from '../../../helpers/utils.js';

const createOfferCheckboxTemplate = (offer, formCount, selectedOffers) => {
  let checked = ``;
  if (selectedOffers) {
    const index = selectedOffers.findIndex((item) => item.title === offer.title);
    checked = `${index !== -1 ? `checked` : ``}`;
  }
  const offerTitle = offer.title;
  const offerPrice = offer.price;
  const name = `${getCebabName(offer.title)}`;
  const id = `${name}-${formCount}`;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${name}" ${checked}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${offerTitle}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>`
  );
};

const createOfferItemTemplate = (offer) => {
  const offerTitle = offer.title;
  const offerPrice = offer.price;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offerTitle}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
    </li>`
  );
};

export {createOfferCheckboxTemplate, createOfferItemTemplate};
