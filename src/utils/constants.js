export const dateFormatDash = 'DD-MM-YYYY';
export const timeSlotFormat = 'hh:mm a';
export const defaultDateFormat = 'DD MMMM YYYY';
export const longDateFormat = 'dddd, DD MMMM YYYY';
export const FULL_DATE = 'dddd, DD MMMM YYYY';
export const TIME_FORMAT = 'hh:mm a';
export const DEFAULT_TIME = '1970-01-01 T00:00:00';

// Navigation
export const LS_BACK = 'goBack';
export const LS_INFO = 'locationState';
export const CATEGORY_NAV_WIDTH = 66;

// layout
export const DEVICE_MIN_WIDTH = 375;
export const MAX_TAB_WIDTH = 166;
export const MAX_CARD_WIDTH = 320;
export const ADDRESS_LENGTH = 85;

// Auth
export const AUTHENTICATED_KEY = 'isAuthenticated';

// FaceBook
export const FACEBOOK = {
  STATUS: {
    CONNECTED: 'connected',
    NOT_AUTHORIZED: 'not_authorized',
    UNKNOWN: 'unknown',
  },
};

// Service
export const SERVICE_MODE = {
  QUEUE: 'queue',
  SCHEDULE: 'schedule',
};

// Booking flow
export const BOOKING = {
  CACHE_DATA: 'qz_booking_cached',
  STEPS: {
    SELECT_PROVIDER: 0,
    CONFIRM_BOOKING: 1,
    VIEW_BOOKING: 2,
  },
  PATH: {
    NORMAL: /booking\/:id/,
    INSTANT: /booking\/instant\/:id/,
    WAITLIST: /booking\/waitlist\/:id/,
  },
};
export const PROFILE = {
  PAGE: {
    EVENT_LIST: 'eventList',
    MY_INFO: 'myInfo',
    WAIT_LIST: 'waitList',
    SURVEY: 'surveyList',
  },
};
export const regExPattern = {
  userName: /\w{3,}/,
  /* eslint-disable-next-line */
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  /* eslint-disable-next-line */
  phoneNumber: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{9,11}$/,
  password: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g,
  registerVerificationCode: /^\d{6}$/,
  connectError: /Cannot connect to services/,
  removedTimeZone: /\..*/,
};
export const LOGIN_TYPES = {
  FB: 'FaceBook',
  GP: 'Google',
};
export const registerPopoverPosition = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};
export const SESSION = {
  TIMEOUT: 3600000, // millisecond
  EXPIRED: {
    title: 'Session has expired',
    message: 'To maintain security, your session periodically expires.'
      + 'To continue booking, please login again!',
  },
};
export const READ_MORE_MAX = 180;
export const DISTANCE = {
  EQUATOR: 40075,
  KM: 'KILOMETERS',
  MI: 'MILES',
  NU: 'NEUTRAL',
};
export const INSTANT_BOOKING_EMPTY = 'All available slots are booked! Thanks for choosing our service!';
export const EVENT_STATUS = {
  WAITING: 'Waiting...',
  COMING: 'Coming Soon',
  EXPIRED: 'Expired',
  CANCELED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  UNSPECIFIED: 'UNSPECIFIED',
};

// There is dependency between TYPE attrs name and the following policies
// E.g, PASSWORD attrs value has password in passwordPolicy
export const POPOVER_TYPE = {
  PASSWORD: 'passwordPolicy',
  TEL: 'telephonePolicy',
};
export const passwordPolicy = {
  statement: 'Password must include at least:',
  items: [
    '8 to 60 characters',
    '1 lowercase character(s)',
    '1 uppercase character(s)',
    '1 digit(s)',
    '1 special character(s) such as #?!@$%^&*-',
  ],
};
export const telephonePolicy = {
  statement: 'Dial mobile phone numbers format:',
  items: [
    '+[country code][area code][phone number]',
    'Example: +61412345678',
  ],
};
