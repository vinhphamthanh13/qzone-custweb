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

export const serviceType = shape({
  id: string.isRequired,
  name: string.isRequired,
  allowProviderSelection: bool.isRequired,
  description: string.isRequired,
  serviceCategoryId: string.isRequired,
});

export const providerType = shape({
  id: string.isRequired,
  familyName: string,
  givenName: string,
});

export const bookingDetailType = shape({
  provider: object,
  time: object,
});

export const providerDetailsType = shape({
  startHour: number,
  displayedStartHour: number,
  durationSec: number,
});

export const socialLoginType = shape({
  twitter: func,
  facebook: func,
  google: func,
});
