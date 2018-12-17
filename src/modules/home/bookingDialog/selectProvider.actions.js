import { handleResponse } from 'api/helpers';
import { searchProvidersByService, searchProviderById } from 'api/home/bookingDialog/selectProvider';

export const SET_LOADING = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_LOADING';
export const SET_PROVIDERS = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_PROVIDERS';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setProviders = payload => ({
  type: SET_PROVIDERS,
  payload,
});

export const getProvidersByService = serviceId => async (dispatch) => {
  dispatch(setLoading(true));
  const response = handleResponse(await searchProvidersByService(serviceId));
  const result = await Promise.all(response.map(resp => searchProviderById(resp.providerId)));
  dispatch(setLoading(false));
  dispatch(setProviders(result.map(handleResponse)));
};
