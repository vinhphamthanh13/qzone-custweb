// Logout

import { Auth } from 'aws-amplify';
import { saveSession, loadSession } from 'config/localStorage';
import { setLoading } from 'actions/common';
import { AUTH_METHOD } from 'config/auth';
import { LOGOUT_ERROR, LOGOUT_SUCCESS } from './constants';

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
  const currentSession = loadSession();
  if (currentSession && (currentSession.isAuthenticated || currentSession.qz_token)) {
    const { provider } = currentSession;
    dispatch(setLoading(true));
    if (provider && provider === 'google') {
      const ga = window.gapi[AUTH_METHOD].getAuthInstance();
      ga.signOut().then(() => {
        ga.disconnect();
        dispatch(logoutSuccess());
        dispatch(setLoading(false));
        saveSession(initSession);
      });
    } else {
      Auth.signOut({ global: true })
        .then((data) => {
          dispatch(logoutSuccess(data));
          dispatch(setLoading(false));
          saveSession(initSession);
        })
        .catch((error) => {
          dispatch(logoutError(error));
          dispatch(setLoading(false));
        });
    }
  }
};
