import {
  objectOf, oneOfType, shape,
  string, number, bool, func, object,
} from 'prop-types';

export const historyType = objectOf(oneOfType([
  object, number, string, func,
]));

export const classesType = objectOf(string);

export const matchType = objectOf(oneOfType([
  object, string, bool,
]));

export const serviceType = shape({
  id: string.isRequired,
  name: string.isRequired,
  allowProviderSelection: bool.isRequired,
  description: string.isRequired,
  serviceCategoryId: string.isRequired,
  image: shape({
    fileUrl: string,
  }),
});

export const socialLoginType = shape({
  twitter: func,
  facebook: func,
  google: func,
});

export const eventType = shape({
  id: string.isRequired,
  customerId: string.isRequired,
  duration: number.isRequired,
  providerName: string.isRequired,
  serviceName: string.isRequired,
  status: string.isRequired,
  type: string.isRequired,
  slot: shape({
    providerId: string.isRequired,
    serviceId: string.isRequired,
    startSec: number.isRequired,
    toSec: number,
  }),
  geoLocation: shape({
    id: string.isRequired,
    city: string.isRequired,
    country: string.isRequired,
    state: string.isRequired,
    streetAddress: string.isRequired,
    coordinates: shape({
      latitude: number.isRequired,
      longitude: number.isRequired,
    }),
  }),
});

export const basicContact = shape({
  name: string,
  telephone: string,
  email: string,
  logo: oneOfType([object, string]),
});
