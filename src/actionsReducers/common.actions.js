import { handleRequest } from 'utils/apiHelpers';
import {
  findEventByCustomerId,
  temporaryServices,
} from 'actionsApi/common';
import { serviceProvidersRating } from 'actionsApi/rating';

export const SET_LOADING = 'COMMON.SET_LOADING';
export const SET_ERROR = 'COMMON.SET_ERROR';
export const RESET_MODAL_STATUS = 'COMMON.RESET_MODAL_STATUS';
export const FIND_EVENT_BY_CUSTOMER_ID = 'HOME.FIND_EVENT_BY_CUSTOMER_ID';
export const SET_SERVICE_PROVIDERS = 'HOME.SET_SERVICE_PROVIDERS';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setError = payload => ({
  type: SET_ERROR,
  payload,
});

export const resetModalStatus = () => ({
  type: RESET_MODAL_STATUS,
});

const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
  payload,
});

const setEventByCustomerId = payload => ({
  type: FIND_EVENT_BY_CUSTOMER_ID,
  payload,
});

export const setRatingService = data => async (dispatch) => {
  dispatch(setLoading(true));
  const rated = await handleRequest(serviceProvidersRating, [data], null);
  if (!rated) {
    dispatch(setError('setRatingService Error'));
  }
  dispatch(setLoading(false));
};

export const findEventByCustomerIdAction = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [eventList, error] = await handleRequest(findEventByCustomerId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setEventByCustomerId(eventList));
  }
  dispatch(setLoading(false));
};

export const setServiceProvidersAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderList, error] = await handleRequest(temporaryServices, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceProviders(serviceProviderList));
  }
  dispatch(setLoading(false));
};
