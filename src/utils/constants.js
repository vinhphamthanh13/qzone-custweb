export const defaultDateFormat = 'DD MMMM YYYY';

export const regExPattern = {
  /* eslint-disable-next-line */
  email: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
  /* eslint-disable-next-line */
  phoneNumber: /^\s*(?:\+?(\d{1,3}))?[- (]*(\d{3})[- )]*(\d{3})[- ]*(\d{4})(?: *[x/#]{1}(\d+))?\s*$/,
  password: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g,
  registerVerificationCode: /^\d{6}$/,
};

export const loginType = {
  FB: 'FaceBook',
  GP: 'Google',
};

export const noop = () => {};

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

export const passwordPolicyTerms = [
  '8 to 60 characters',
  '1 lowercase character(s)',
  '1 uppercase character(s)',
  '1 digit(s)',
  '1 special character(s) such as #?!@$%^&*-',
];
