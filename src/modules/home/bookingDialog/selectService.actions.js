import { handleResponse } from 'api/helpers';
import { searchServicesByOrgId } from 'api/home/bookingDialog/selectService';

export const SET_LOADING = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_LOADING';
export const SET_SERVICES = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_SERVICES';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setServices = payload => ({
  type: SET_SERVICES,
  payload,
});

export const getServicesByOrgId = orgId => async (dispatch) => {
  dispatch(setLoading(true));
  const result = await searchServicesByOrgId(orgId);
  dispatch(setLoading(false));
  dispatch(setServices(handleResponse(result)));
};
