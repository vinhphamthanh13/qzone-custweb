// Logout

import { Auth } from 'aws-amplify';
import { setLoading } from 'actionsReducers/common.actions';
import { AUTH_METHOD, PROVIDER } from 'config/auth';
import {
  LOGOUT_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR_RST,
} from './constants';
import { storeUserSessionLogin } from './login';

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

export const logout = authenticator => (dispatch) => {
  const { isAuthenticated, authProvider } = authenticator;
  console.log('logout dispatah huh??????');
  if (isAuthenticated) {
    dispatch(setLoading(true));
    if (authProvider && authProvider === PROVIDER.GOOGLE) {
      const ga = window.gapi[AUTH_METHOD].getAuthInstance();
      ga.signOut().then(() => {
        ga.disconnect();
        dispatch(logoutSuccess());
        dispatch(setLoading(false));
        dispatch(storeUserSessionLogin(initSession));
        // saveSession(initSession);
      });
    } else {
      Auth.signOut({ global: true })
        .then((data) => {
          dispatch(logoutSuccess(data));
          dispatch(setLoading(false));
          dispatch(storeUserSessionLogin(initSession));
          // saveSession(initSession);
        })
        .catch((error) => {
          dispatch(logoutError(error));
          dispatch(setLoading(false));
        });
    }
  }
};
