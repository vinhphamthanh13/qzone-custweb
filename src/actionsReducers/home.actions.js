import { serviceProvidersNearBy } from 'actionsApi/home';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const SET_SERVICE_PROVIDER_NEAR_BY = 'HOME.SET_SERVICE_PROVIDER_NEAR_BY';
const setServiceProviderNearBy = payload => ({
  type: SET_SERVICE_PROVIDER_NEAR_BY,
  payload,
});
export const setServiceProviderNearByAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderNearByList, error] = await handleRequest(serviceProvidersNearBy, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceProviderNearBy(serviceProviderNearByList));
  }
  dispatch(setLoading(false));
};
