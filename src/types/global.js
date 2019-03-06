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
  image: shape({
    fileUrl: string,
  }),
});

export const providerType = shape({
  id: string.isRequired,
  familyName: string,
  givenName: string,
  providerInformation: shape({
    organizationId: string,
    timeZoneId: string,
    description: string,
    businessId: string,
  }),
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

export const userDetailType = shape({
  givenName: string,
  familyName: string,
  telephone: string,
  email: string,
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
