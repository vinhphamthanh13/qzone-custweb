import {
  serviceById,
  providersByServiceId,
} from 'actionsApi/booking';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const GET_SERVICE_BY_ID = 'BOOKING.GET_SERVICE_BY_ID';
export const SET_PROVIDERS_BY_SERVICE_ID = 'BOOKING.SET_PROVIDERS_BY_SERVICE_ID';

const getServiceById = payload => ({
  type: GET_SERVICE_BY_ID,
  payload,
});
const setProvidersByServiceId = payload => ({
  type: SET_PROVIDERS_BY_SERVICE_ID,
  payload,
});

export const getServiceByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [service, error] = await handleRequest(serviceById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(getServiceById(service));
  }
  dispatch(setLoading(false));
};

export const setProvidersByServiceIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [providersById, error] = await handleRequest(providersByServiceId, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProvidersByServiceId(providersById));
  }
  dispatch(setLoading(false));
};
