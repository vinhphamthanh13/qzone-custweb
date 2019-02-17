import {
  objectOf, oneOfType, arrayOf, shape,
  string, number, bool, func, object,
} from 'prop-types';

export const historyType = objectOf(oneOfType([
  object, number, string, func,
]));

export const locationType = objectOf(oneOfType([
  object, string,
]));

export const classesType = objectOf(string);

export const routesType = arrayOf(object);

export const matchType = objectOf(oneOfType([
  object, string, bool,
]));

export const serviceType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  allowProviderSelection: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  serviceCategoryId: PropTypes.string.isRequired,
});

export const providerType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  familyName: PropTypes.string,
  givenName: PropTypes.string,
});

export const bookingDetailType = PropTypes.shape({
  provider: PropTypes.object,
  time: PropTypes.object,
});

export const providerDetailsType = PropTypes.shape({
  startHour: PropTypes.number,
  displayedStartHour: PropTypes.number,
  durationSec: PropTypes.number,
});

export const socialLoginType = shape({
  twitter: func,
  facebook: func,
  google: func,
});
