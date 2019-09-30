import { flattenDeep, get } from 'lodash';
import { handleRequest } from 'utils/apiHelpers';
import {
  findEventByCustomerId,
  temporaryServices,
  eventById,
  eventByIdCancel,
  reschedule,
  servicesByServiceCategoryBulk,
  temporaryServicesById,
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
export const SET_RESCHEDULE_STATUS = 'COMMON.SET_RESCHEDULE_STATUS';
export const SERVICES_BY_SERVICE_CATEGORY_ID = 'COMMON.SERVICES_BY_SERVICE_CATEGORY_ID';
export const SET_TAB_ORDER = 'COMMON.SET_TAB_ORDER';
export const SET_RESPONSIVE_CHUNK_FACTOR = 'COMMON.SET_RESPONSIVE_CHUNK_FACTOR';
export const CANCEL_EVENT_BY_ID = 'COMMON.CANCEL_EVENT_BY_ID';
export const TEMPORARY_SERVICES_BY_ID = 'COMMON.TEMPORARY_SERVICES_BY_ID';

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
const servicesByServiceCategoryIdBulkAction = payload => ({
  type: SERVICES_BY_SERVICE_CATEGORY_ID,
  payload,
});
const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
  payload,
});
const setEventByCustomerId = payload => ({
  type: FIND_EVENT_BY_CUSTOMER_ID,
  payload,
});
export const setTabOrder = payload => ({
  type: SET_TAB_ORDER,
  payload,
});
export const setChunkFactorAction = payload => ({
  type: SET_RESPONSIVE_CHUNK_FACTOR,
  payload,
});
const setTemporaryServiceByLocationAction = payload => ({
  type: SET_TEMPORARY_SERVICE_BY_LOCATION,
  payload,
});
const temporaryServicesByIdAction = payload => ({
  type: TEMPORARY_SERVICES_BY_ID,
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
export const findEventByCustomerIdAction = (id, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [eventList, error] = await handleRequest(findEventByCustomerId, [id, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setEventByCustomerId(eventList));
  }
  dispatch(setLoading(false));
};
const setEventByIdAction = payload => ({
  type: SET_EVENT_BY_ID,
  payload,
});
export const setTemporaryServices = () => async (dispatch) => {
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
export const setEventById = (id, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(eventById, [id, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setEventByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const cancelEventByIdAction = payload => ({
  type: CANCEL_EVENT_BY_ID,
  payload,
});
export const setRescheduleStatusAction = payload => ({
  type: SET_RESCHEDULE_STATUS,
  payload,
});
export const rescheduleStatusAction = payload => ({
  type: SET_RESCHEDULE_STATUS,
  payload,
});
export const rescheduleEvent = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [, error] = await handleRequest(reschedule, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setRescheduleStatusAction(200));
    dispatch(setSucceed('You have been rescheduled your event successfully!'));
  }
  dispatch(setLoading(false));
};
export const servicesByServiceCategoryIdBulkApi = (listId, catName) => async dispatch => {
  dispatch(setLoading(true));
  const [resultBulk, errorBulk] = await servicesByServiceCategoryBulk(listId);
  if (errorBulk) {
    dispatch(setError(get(JSON.parse(errorBulk), 'response.data.message')));
  } else {
    const responseBulk = [];
    resultBulk.map(item => responseBulk.push(...item.data.objects));
    dispatch(servicesByServiceCategoryIdBulkAction({ [catName]: responseBulk }));
  }
  dispatch(setLoading(false));
};

// Decoupling
export const setEventByIdApi = (id, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(eventById, [id, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setEventByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const cancelEventByIdApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(eventByIdCancel, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(cancelEventByIdAction(200 || result.success));
    dispatch(setSucceed('Your event is cancelled!'));
  }
  dispatch(setLoading(false));
};
export const temporaryServicesByIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(temporaryServicesById, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(temporaryServicesByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const rescheduleEventApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [, error] = await handleRequest(reschedule, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(rescheduleStatusAction(200));
    dispatch(setSucceed('You have been rescheduled your event successfully!'));
  }
  dispatch(setLoading(false));
};
