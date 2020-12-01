const ACTIVITY_TYPES = [`check-in`, `sightseeing`, `restaurant`];

const BAR_HEIGHT = 55;

const ChartValues = {
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
  LABELS_FONT_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  LAYOUT_PADDING_LEFT: 45,
  SCALES_Y_PADDING: 5,
  SCALES_Y_FONTSIZE: 13,
};

const eventTypesMap = {
  'taxi': `Taxi to `,
  'bus': `Bus to `,
  'train': `Train to `,
  'ship': `Ship to `,
  'transport': `Transport to `,
  'drive': `Drive to `,
  'flight': `Flight to `,
  'check-in': `Check-in in `,
  'sightseeing': `Sightseeing in `,
  'restaurant': `Restaurant in `
};

const filterTypeMap = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const Mode = {
  CREATE: `create`,
  VIEW: `view`,
  EDIT: `edit`
};

const keyMap = {
  EVENTS: `-events`,
  DESTINATIONS: `-destinations`,
  OFFERS: `-offers`
};

const sortTypeMap = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const TRANSFER_TYPE = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

const tripPointIconMap = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚆`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛`,
  'restaurant': `🍴`,
};

export {BAR_HEIGHT, ChartValues, ACTIVITY_TYPES, eventTypesMap, filterTypeMap, Mode, keyMap, sortTypeMap, TRANSFER_TYPE, tripPointIconMap};
