import { setLoading, setError } from 'actionsReducers/common.actions';
import get from 'lodash/get';
import { handleRequest } from 'utils/apiHelpers';
import {
  users,
  serviceByProviderId,
  temporaryServicesByServiceId,
  availabilitiesByTemporaryServiceIdBulk,
  availabilitiesByTemporaryServiceId,
  queryProvider,
  tempServiceDateProviderByServiceId,
  providersByServiceId,
  availabilitiesProviderServiceDate,
} from 'actionsApi/provider';

export const SET_PROVIDER_DETAIL = 'PROVIDER.SET_PROVIDER_DETAIL';
export const USERS_BY_ID = 'PROVIDER.USERS_BY_ID';
export const SET_PROVIDER_SERVICE = 'PROVIDER.SET_PROVIDER_SERVICE';
export const TEMPORARY_SERVICES_BY_SERVICE_ID = 'TEMPORARY_SERVICE.TEMPORARY_SERVICES_BY_SERVICE_ID';
export const AVAILABILITIES_BY_TMP_SERVICE_ID = 'APPOINTMENT_RESOURCE.AVAILABILITIES_BY_TMP_SERVICE_ID';
export const RESCHEDULE_AVAILABILITIES_BY_TMP_SERVICE_ID =
  'APPOINTMENT_RESOURCE.RESCHEDULE_AVAILABILITIES_BY_TMP_SERVICE_ID';
export const INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID = 'APPOINTMENT_RESOURCE.INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID';
export const SELECT_BOOKING_DETAIL = 'BOOKING.SELECT_BOOKING_DETAIL';
export const CLEAR_SELECT_BOOKING_DETAIL = 'BOOKING.CLEAR_SELECT_BOOKING_DETAIL';
export const WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID = 'PROVIDER.WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID';
export const QUERY_PROVIDER = 'PROVIDER.QUERY_PROVIDER';
export const CLEAR_QUERIED_PROVIDER = 'PROVIDER.CLEAR_QUERIED_PROVIDER';
export const TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID = 'PROVIDER.TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID';
export const CLEAR_TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID = 'PROVIDER.CLEAR_TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID';
export const SET_SERVICE_DATE_PROVIDERS = 'PROVIDER.SET_SERVICE_DATE_PROVIDERS';
export const SET_PROVIDERS_BY_SERVICE_ID = 'PROVIDER.SET_PROVIDERS_BY_SERVICE_ID';
export const CLEAR_PROVIDERS_BY_SERVICE_ID = 'PROVIDER.CLEAR_PROVIDERS_BY_SERVICE_ID';
export const SET_BOOK_NOW = 'PROVIDER.SET_BOOK_NOW';
export const CLEAR_BOOK_NOW = 'PROVIDER.CLEAR_BOOK_NOW';
export const QUERY_AVAILABILITIES_BY_DATE = 'PROVIDER.QUERY_AVAILABILITIES_BY_DATE';
const setProviderDetail = payload => ({
  type: SET_PROVIDER_DETAIL,
  payload,
});
const setProviderService = payload => ({
  type: SET_PROVIDER_SERVICE,
  payload,
});
const waitListTemporaryServicesByServiceIdAction = payload => ({
  type: WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID,
  payload,
});
const availabilitiesByTemporaryServiceIdAction = payload => ({
  type: AVAILABILITIES_BY_TMP_SERVICE_ID,
  payload,
});
const rescheduledAvailabilitiesByTemporaryServiceIdAction = payload => ({
  type: RESCHEDULE_AVAILABILITIES_BY_TMP_SERVICE_ID,
  payload,
});
const instantAvailabilitiesByTemporaryServiceIdAction = payload => ({
  type: INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID,
  payload,
});
const usersByIdAction = payload => ({
  type: USERS_BY_ID,
  payload,
});
const queryProviderAction = payload => ({
  type: QUERY_PROVIDER,
  payload,
});
const setProvidersByServiceIdAction = payload => ({
  type: SET_PROVIDERS_BY_SERVICE_ID,
  payload,
});
export const clearProvidersByServiceId = () => ({
  type: CLEAR_PROVIDERS_BY_SERVICE_ID,
});
export const clearQueriedProviderAction = () => ({
  type: CLEAR_QUERIED_PROVIDER,
});
export const setBookNowAction = payload => ({
  type: SET_BOOK_NOW,
  payload,
});
export const clearBookNowAction = () => ({
  type: CLEAR_BOOK_NOW,
});
const queryAvailabilitiesByDateAction = payload => ({
  type: QUERY_AVAILABILITIES_BY_DATE,
  payload,
});
// Async
export const setProviderDetailAction = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [userDetail, error] = await handleRequest(users, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProviderDetail(userDetail));
  }
  dispatch(setLoading(false));
};
export const availabilitiesByTemporaryServiceIdApi = (tId, sId, pId, locId) => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(availabilitiesByTemporaryServiceId, [tId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(rescheduledAvailabilitiesByTemporaryServiceIdAction({ [`${sId}-${pId}-${locId}`]: result }));
  }
  dispatch(setLoading(false));
};
const tempServiceDateProviderByServiceIdAction = payload => ({
  type: TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID,
  payload,
});
export const clearTempServiceDateProviderByServiceIdAction = () => ({
  type: CLEAR_TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID,
});
export const availabilitiesByTemporaryServiceIdBulkApi = (list, sId, pId, locId) => async dispatch => {
  dispatch(setLoading(true));
  const [resultBulk, errorBulk] = await availabilitiesByTemporaryServiceIdBulk(list);
  if (errorBulk) {
    dispatch(setError(get(JSON.parse(errorBulk), 'response.data.message')));
  } else {
    const responseBulk = [];
    resultBulk.map(item => item.data.objects && responseBulk.push(...item.data.objects));
    dispatch(availabilitiesByTemporaryServiceIdAction({ [`${sId}-${pId}-${locId}`]: responseBulk }));
  }
  dispatch(setLoading(false));
};
export const instantAvailabilitiesByTemporaryServiceIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(availabilitiesByTemporaryServiceId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(instantAvailabilitiesByTemporaryServiceIdAction(result));
  }
  dispatch(setLoading(false));
};
export const setProviderServiceAction = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [services, error] = await handleRequest(serviceByProviderId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProviderService(services));
  }
  dispatch(setLoading(false));
};
// Decoupling
export const selectBookingDetail = payload => ({
  type: SELECT_BOOKING_DETAIL,
  payload,
});
export const clearSelectedBookingDetail = () => ({
  type: CLEAR_SELECT_BOOKING_DETAIL,
});
export const setServiceDateProviders = payload => ({
  type: SET_SERVICE_DATE_PROVIDERS,
  payload,
});
export const usersByIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(users, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(usersByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const waitListTemporaryServicesByServiceIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(temporaryServicesByServiceId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(waitListTemporaryServicesByServiceIdAction(result));
  }
  dispatch(setLoading(false));
};
export const queryProviderApi = data => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(queryProvider, [data]);
  if (error) {
    dispatch(queryProviderAction([])); // in case of failed or no result return
  } else {
    dispatch(queryProviderAction(result));
  }
  dispatch(setLoading(false));
};
export const tempServiceDateProviderByServiceIdApi = sId => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(tempServiceDateProviderByServiceId, [sId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(tempServiceDateProviderByServiceIdAction({ [sId]: result }));
  }
  dispatch(setLoading(false));
};
export const setProvidersByServiceIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(providersByServiceId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProvidersByServiceIdAction({ [id]: result }));
  }
  dispatch(setLoading(false));
};
export const queryAvailabilitiesByDateApi = data => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(availabilitiesProviderServiceDate, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(queryAvailabilitiesByDateAction(result));
  }
  dispatch(setLoading(false));
};
