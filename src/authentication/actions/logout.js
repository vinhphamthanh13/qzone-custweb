// Logout

import { Auth } from 'aws-amplify';
import { saveSession, loadSession } from 'config/localStorage';
import { setLoading } from 'actionsReducers/common.actions';
import { AUTH_METHOD, PROVIDER } from 'config/auth';
import {
  LOGOUT_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR_RST,
  AUTHENTICATED_KEY,
} from './constants';

const initSession = {};

const resetLogoutError = () => ({
  type: LOGOUT_ERROR_RST,
});

export const clearLogoutErrorStatus = () => dispatch => dispatch(resetLogoutError());

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
  if (currentSession && currentSession[AUTHENTICATED_KEY]) {
    const { provider } = currentSession;
    dispatch(setLoading(true));
    if (provider && provider === PROVIDER.GOOGLE) {
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
