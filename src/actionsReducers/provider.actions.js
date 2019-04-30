import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';
import {
  users,
  serviceByProviderId,
  temporaryServices,
} from 'actionsApi/provider';

export const SET_PROVIDER_DETAIL = 'PROVIDER.SET_PROVIDER_DETAIL';
export const SET_PROVIDER_SERVICE = 'PROVIDER.SET_PROVIDER_SERVICE';
export const SET_SERVICE_PROVIDER = 'PROVIDER.SET_SERVICE_PROVIDER';

const setProviderDetail = payload => ({
  type: SET_PROVIDER_DETAIL,
  payload,
});

const setProviderService = payload => ({
  type: SET_PROVIDER_SERVICE,
  payload,
});

const setServiceProvider = payload => ({
  type: SET_SERVICE_PROVIDER,
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

export const setServiceProviderAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderList, error] = await handleRequest(temporaryServices, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceProvider(serviceProviderList));
  }
  dispatch(setLoading(false));
};
