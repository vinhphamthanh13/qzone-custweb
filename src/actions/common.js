import { handleRequest } from 'utils/apiHelpers';
import { rateAppointmentByUser } from 'api/rating';

export const SET_LOADING = 'LOADING';
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
});

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setRatingService = data => async (dispatch) => {
  dispatch(setLoading(true));
  const rated = await handleRequest(rateAppointmentByUser, [data], []);
  console.log('rated', rated);
  if (rated) {
    dispatch(setLoading(false));
  } else {
    dispatch(setLoading(false));
    console.log('error');
  }
};
