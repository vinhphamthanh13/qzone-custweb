import { handleRequest } from 'utils/apiHelpers';
import { serviceProvidersRating } from 'api/rating';

export const SET_LOADING = 'COMMON.SET_LOADING';
export const SET_ERROR = 'COMMON.SET_ERROR';
export const RESET_ERROR = 'COMMON.RESET_ERROR';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setError = payload => ({
  type: SET_ERROR,
  payload,
});

export const resetErrorMessage = () => ({
  type: RESET_ERROR,
});

export const setRatingService = data => async (dispatch) => {
  dispatch(setLoading(true));
  const rated = await handleRequest(serviceProvidersRating, [data], null);
  if (!rated) {
    dispatch(setError('setRatingService Error'));
  }
  dispatch(setLoading(false));
};
