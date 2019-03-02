// Logout

import { Auth } from 'aws-amplify';
import { saveSession } from 'config/localStorage';
import { LOGOUT_ERROR, LOGOUT_SUCCESS } from './constants';
import { setLoading } from '../../actions/common';

const initSession = {};

const logoutSuccess = payload => ({
  type: LOGOUT_SUCCESS,
  payload,
});

const logoutError = payload => ({
  type: LOGOUT_ERROR,
  payload,
});

export const logout = () => (dispatch) => {
  dispatch(setLoading(true));
  Auth.signOut({ global: true })
    .then((data) => {
      dispatch(setLoading(false));
      dispatch(logoutSuccess(data));
      saveSession(initSession);
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(logoutError(error));
    });
};
