export const defaultDateFormat = 'DD MMMM YYYY';

export const BOOKING = {
  CACHE_DATA: 'qz_booking_cached',
};

export const regExPattern = {
  /* eslint-disable-next-line */
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  /* eslint-disable-next-line */
  phoneNumber: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
  password: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g,
  registerVerificationCode: /^\d{6}$/,
};

export const loginType = {
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
    '+[country code][are code][phone number]',
    'Example: +61412345678',
  ],
};
