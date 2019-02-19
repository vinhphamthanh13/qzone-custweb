export const SET_LOADING = 'LOADING';
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
});

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});
