import { Auth } from 'aws-amplify';
import { GOOGLE_ID, AUTH_METHOD } from 'config/auth';
import { setLoading } from 'actions/common';
import { getCustomerByEmail as loginApi } from 'api/auth';
import { saveSession } from 'config/localStorage';
import { STORE_USER_LOGIN, STORE_USER_ERROR } from './constants';

// Redux
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
          const { idToken: { jwtToken, payload }, refreshToken: { token } } = json.signInUserSession;
          // eslint-disable-next-line
          const { exp } = payload;
          console.log('login data', json.signInUserSession);
          if (payload.email_verified) {
            loginApi({ email })
              .then((response) => {
                if (response.data.object) {
                  const { id, givenName } = response.data.object;
                  const session = {
                    id,
                    username: givenName,
                    qz_token: jwtToken,
                    qz_refresh_token: token,
                    expiration: exp,
                    isAuthenticated: response.data.isAuthenticated,
                  };
                  dispatch(storeUserLogin(session));
                  saveSession(session);
                }
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
