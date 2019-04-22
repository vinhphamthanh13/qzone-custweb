import { handleRequest } from 'utils/apiHelpers';
import { findEventByCustomerId } from 'api/common';
import { serviceProvidersRating } from 'api/rating';

export const SET_LOADING = 'COMMON.SET_LOADING';
export const SET_ERROR = 'COMMON.SET_ERROR';
export const RESET_ERROR = 'COMMON.RESET_ERROR';
export const FIND_EVENT_BY_CUSTOMER_ID = 'HOME.FIND_EVENT_BY_CUSTOMER_ID';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setError = payload => ({
  type: SET_ERROR,
  payload,
});

export const resetErrorMessage = () => ({
  type: RESET_ERROR,
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
