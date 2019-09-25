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
} from 'actionsApi/provider';

export const SET_PROVIDER_DETAIL = 'PROVIDER.SET_PROVIDER_DETAIL';
export const SET_PROVIDER_SERVICE = 'PROVIDER.SET_PROVIDER_SERVICE';
export const TEMPORARY_SERVICES_BY_SERVICE_ID = 'TEMPORARY_SERVICE.TEMPORARY_SERVICES_BY_SERVICE_ID';
export const AVAILABILITIES_BY_TMP_SERVICE_ID = 'APPOINTMENT_RESOURCE.AVAILABILITIES_BY_TMP_SERVICE_ID';
export const SELECT_BOOKING_DETAIL = 'BOOKING.SELECT_BOOKING_DETAIL';
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
const availabilitiesByTemporaryServiceIdAction = payload => ({
  type: AVAILABILITIES_BY_TMP_SERVICE_ID,
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
