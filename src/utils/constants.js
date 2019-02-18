export const defaultDateFormat = 'DD MMMM YYYY';

export const regExPattern = {
  /* eslint-disable-next-line */
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
