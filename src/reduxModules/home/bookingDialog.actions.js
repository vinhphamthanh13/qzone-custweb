import { postEvent } from 'api/home/bookingDialog';
import { handleRequest } from 'utils/apiHelpers';

export const SET_LOADING = 'HOME.BOOKING_DIALOG.SET_LOADING';
export const SET_STATUS = 'HOME.BOOKING_DIALOG.SET_STATUS';
export const RESET_STATUS = 'HOME.BOOKING_DIALOG.RESET_STATUS';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setStatus = payload => ({
  type: SET_STATUS,
  payload,
});

export const resetStatus = () => ({
  type: RESET_STATUS,
});

export const bookEvent = payload => async (dispatch) => {
  dispatch(setLoading(true));
  const [, error] = await handleRequest(postEvent, [payload]);
  if (error) {
    dispatch(setStatus({ type: 'error', message: error }));
  } else {
    dispatch(setStatus({ type: 'success', message: '' }));
  }
  dispatch(setLoading(false));
};
