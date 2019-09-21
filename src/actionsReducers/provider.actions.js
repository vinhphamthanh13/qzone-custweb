import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  users,
  serviceByProviderId,
  temporaryServicesByServiceId,
} from 'actionsApi/provider';

export const SET_PROVIDER_DETAIL = 'PROVIDER.SET_PROVIDER_DETAIL';
export const SET_PROVIDER_SERVICE = 'PROVIDER.SET_PROVIDER_SERVICE';
export const TEMPORARY_SERVICES_BY_SERVICE_ID = 'TEMPORARY_SERVICE.TEMPORARY_SERVICES_BY_SERVICE_ID';
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
export const providerDetailApi = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(users, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProviderDetail(result));
  }
  dispatch(setLoading(false));
};
export const temporaryServicesByServiceIdApi = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(temporaryServicesByServiceId, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(temporaryServicesByServiceIdAction(result));
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
