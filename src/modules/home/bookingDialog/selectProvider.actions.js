import { handleResponse } from 'api/helpers';
import { searchProvidersByService } from 'api/home/bookingDialog/selectProvider';

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

export const getProvidersByService = orgId => async (dispatch) => {
  dispatch(setLoading(true));
  const result = await searchProvidersByService(orgId);
  dispatch(setLoading(false));
  dispatch(setProviders(handleResponse(result)));
};
