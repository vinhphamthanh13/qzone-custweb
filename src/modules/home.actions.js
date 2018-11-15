export const SET_SERVICE_CATEGORIES = 'SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'SET_SERVICES';

export const setServiceCategories = payload => ({
  type: SET_SERVICE_CATEGORIES,
  payload,
});

export const setServices = payload => ({
  type: SET_SERVICES,
  payload,
});
