import PropTypes from 'prop-types';

export const historyType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.object, PropTypes.number, PropTypes.string, PropTypes.func,
]));

export const locationType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.object, PropTypes.string,
]));

export const classesType = PropTypes.objectOf(PropTypes.string);

export const routesType = PropTypes.arrayOf(PropTypes.object);

export const matchType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.object, PropTypes.string, PropTypes.bool,
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
