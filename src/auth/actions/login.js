import { Auth } from 'aws-amplify';
import { GOOGLE_ID, AUTH_METHOD } from 'config/auth';
// import BASE_URL from 'config/url';
import { setLoading } from 'actions/common';
import { getCustomerByEmail as loginApi } from 'api/auth';
import {
  STORE_USER_LOGIN, STORE_USER_ERROR, LOGOUT_SUCCESS, LOGOUT_ERROR,
} from './constants';

export const storeUserLogin = payload => ({
  type: STORE_USER_LOGIN,
  payload,
});

export const storeUserError = payload => ({
  type: STORE_USER_ERROR,
  payload,
});

// Google User

export const initGapi = () => {
  // init the Google SDK client
  const g = window.gapi;
  g.load(AUTH_METHOD, () => {
    g[AUTH_METHOD].init({
      client_id: GOOGLE_ID,
      // authorized scopes
      scope: 'profile email openid',
    });
  });
};

export const createGoogleScript = () => {
  // load the Google SDK
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.async = true;
  script.onload = initGapi;
  document.body.appendChild(script);
};

const getAWSCredentials = async (googleUser, dispatch) => {
  // eslint-disable-next-line
  const { id_token, expires_at } = googleUser.getAuthResponse();
  const profile = googleUser.getBasicProfile();
  const user = {
    email: profile.getEmail(),
    name: profile.getName(),
  };
  const credentials = await Auth.federatedSignIn(
    'google',
    { token: id_token, expires_at },
    user,
  );
  if (credentials) {
    dispatch(storeUserLogin({
      email: user.email,
      token: id_token,
      expiration: expires_at,
      isAuthenticated: credentials.authenticated,
      userName: user.name,
    }));
    console.log('Login G++ successful');
    dispatch(setLoading(false));
  } else {
    console.log('Cannot login Google++');
    dispatch(storeUserError({ message: 'Cannot login with Gmail' }));
    dispatch(setLoading(false));
  }
};

export const googleLogIn = () => (dispatch) => {
  dispatch(setLoading(true));
  const ga = window.gapi[AUTH_METHOD].getAuthInstance();
  ga.signIn().then(
    async (googleUser) => {
      console.log('google user---', googleUser);
      await getAWSCredentials(googleUser, dispatch);
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setLoading(false));
      console.log('Signing Google Account error', error);
    },
  );
};

// Login Actions

export const login = (value) => {
  const { email, password } = value;
  return async (dispatch) => {
    dispatch(setLoading(true));
    Auth.signIn(email, password)
      .then((json) => {
        if (json) {
          const { idToken: { jwtToken, payload } } = json.signInUserSession;
          const { exp, sub } = payload;
          if (payload.email_verified) {
            loginApi({ email })
              .then((response) => {
                dispatch(storeUserLogin({
                  token: jwtToken,
                  userName: sub,
                  expiration: exp,
                  isAuthenticated: response.data.isAuthenticated,
                }));
                dispatch(setLoading(false));
              })
              .catch((error) => {
                dispatch(storeUserError(error));
                dispatch(setLoading(false));
              });
          }
        } else {
          dispatch(storeUserError('Topology Error'));
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        dispatch(storeUserError(error));
        dispatch(setLoading(false));
      });
  };
};

// Logout

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
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(logoutError(error));
    });
};
