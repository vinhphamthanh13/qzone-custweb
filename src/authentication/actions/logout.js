/* eslint-disable no-undef */

import { Auth } from 'aws-amplify';
import { setLoading } from 'actionsReducers/common.actions';
import { AUTH_METHOD, PROVIDER } from 'config/auth';
import {
  createGoogleScript,
} from './login';

export const logout = authenticator => (dispatch) => {
  const { isAuthenticated, authProvider } = authenticator;

  if (isAuthenticated) {
    dispatch(setLoading(true));
    if (authProvider && authProvider === PROVIDER.GOOGLE) {
      let ga = window.gapi && window.gapi[AUTH_METHOD]
        ? window.gapi.auth2.getAuthInstance() : null;

      if (!ga) {
        createGoogleScript();
        ga = window.gapi[AUTH_METHOD].getAuthInstance();
      }

      ga.signOut().then(() => {
        ga.disconnect();
        dispatch(setLoading(false));
      });
    } else if (authProvider && authProvider === PROVIDER.FACEBOOK) {
      FB.getLoginStatus((logoutResponse) => {
        if (logoutResponse.status === 'connected') {
          FB.logout();
        }
        dispatch(setLoading(false));
      });
    } else {
      Auth.signOut({ global: true })
        .then(() => {
          dispatch(setLoading(false));
        })
        .catch(() => {
          dispatch(setLoading(false));
        });
    }
    dispatch({
      type: 'RESET_APP',
    });
  }
};
