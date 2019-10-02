import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { get } from 'lodash';
import { handleRequest } from 'utils/apiHelpers';
import {
  users,
  serviceByProviderId,
  temporaryServicesByServiceId,
  availabilitiesByTemporaryServiceIdBulk,
  availabilitiesByTemporaryServiceId,
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
export const WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID = 'PROVIDER.WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID';
const setProviderDetail = payload => ({
  type: SET_PROVIDER_DETAIL,
  payload,
});
const setProviderService = payload => ({
  type: SET_PROVIDER_SERVICE,
  payload,
});
const temporaryServicesByServiceIdAction = payload => ({
  type: TEMPORARY_SERVICES_BY_SERVICE_ID,
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
export const temporaryServicesByServiceIdApi = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(temporaryServicesByServiceId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(temporaryServicesByServiceIdAction({ [id]: result}));
  }
  dispatch(setLoading(false));
};
export const rescheduledAvailabilitiesByTemporaryServiceIdApi = (tId, sId, pId, locId) => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(availabilitiesByTemporaryServiceId, [tId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(rescheduledAvailabilitiesByTemporaryServiceIdAction({ [`${sId}-${pId}-${locId}`]: result }));
  }
  dispatch(setLoading(false));
};

export const availabilitiesByTemporaryServiceIdApi = (list, sId, pId, locId) => async dispatch => {
  dispatch(setLoading(true));
  const [resultBulk, errorBulk] = await availabilitiesByTemporaryServiceIdBulk(list);
  if (errorBulk) {
    dispatch(setError(get(JSON.parse(errorBulk), 'response.data.message')));
  } else {
    const responseBulk = [];
    resultBulk.map(item => responseBulk.push(...item.data.objects));
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
export const selectBookingDetail = payload => ({
  type: SELECT_BOOKING_DETAIL,
  payload,
});
// Decoupling
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
