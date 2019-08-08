import { flattenDeep, get } from 'lodash';
import { handleRequest } from 'utils/apiHelpers';
import {
  findEventByCustomerId,
  temporaryServices,
  eventById,
  reschedule,
} from 'actionsApi/common';
import { serviceProvidersRating } from 'actionsApi/rating';

export const SET_LOADING = 'COMMON.SET_LOADING';
export const SET_ERROR = 'COMMON.SET_ERROR';
export const SET_SUCCEED = 'COMMON.SET_SUCCEED';
export const RESET_MODAL_STATUS = 'COMMON.RESET_MODAL_STATUS';
export const FIND_EVENT_BY_CUSTOMER_ID = 'HOME.FIND_EVENT_BY_CUSTOMER_ID';
export const SET_SERVICE_PROVIDERS = 'HOME.SET_SERVICE_PROVIDERS';
export const SET_TEMPORARY_SERVICE_BY_LOCATION = 'COMMON.SET_TEMPORARY_SERVICE_BY_LOCATION';
export const SET_EVENT_BY_ID = 'COMMON.SET_EVENT_BY_ID';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setError = payload => ({
  type: SET_ERROR,
  payload,
});

export const setSucceed = payload => ({
  type: SET_SUCCEED,
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

const setTemporaryServiceByLocationAction = payload => ({
  type: SET_TEMPORARY_SERVICE_BY_LOCATION,
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

export const setEventByIdAction = payload => ({
  type: SET_EVENT_BY_ID,
  payload,
});

export const setServiceProvidersAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(temporaryServices, []);
  const tempList = get(result, 'temporaryServices');
  if (error) {
    dispatch(setError(error));
  }
  if (tempList && Object.keys(tempList).length > 0) {
    const serviceProvider = Object.keys(tempList).map(locationId => tempList[locationId]);
    dispatch(setTemporaryServiceByLocationAction(tempList));
    dispatch(setServiceProviders(flattenDeep(serviceProvider)));
  }
  dispatch(setLoading(false));
};

export const setEventById = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(eventById, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setEventByIdAction(result));
  }
  dispatch(setLoading(false));
};

export const rescheduleEvent = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [, error] = await handleRequest(reschedule, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setSucceed('You have been rescheduled your event successfully!'));
  }
  dispatch(setLoading(false));
};
