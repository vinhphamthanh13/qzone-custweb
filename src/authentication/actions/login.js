import { Auth } from 'aws-amplify';
import { GOOGLE_ID, AUTH_METHOD, PROVIDER } from 'config/auth';
import { setLoading } from 'actions/common';
import { getCustomerByEmail as loginApi, saveSocialEmail as socialLoginApi } from 'api/auth';
import { saveSession } from 'config/localStorage';
import { STORE_USER_SESSION_LOGIN, STORE_USER_SESSION_ERROR } from './constants';

// Redux
const storeUserSessionLogin = payload => ({
  type: STORE_USER_SESSION_LOGIN,
  payload,
});

const storeUserSessionError = payload => ({
  type: STORE_USER_SESSION_ERROR,
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

const getAWSCredentials = (googleUser, dispatch) => {
  // eslint-disable-next-line
  const { id_token, expires_in } = googleUser.getAuthResponse();
  const profile = googleUser.getBasicProfile();
  const email = profile.getEmail();
  const name = profile.getName();
  const user = { email, name };
  Auth.federatedSignIn(
    PROVIDER.GOOGLE,
    { token: id_token, expires_in },
    user,
  )
    .then((credentials) => {
      const socialAcc = {
        email: user.email,
        userType: 'CUSTOMER',
      };
      if (credentials.authenticated) {
        socialLoginApi(socialAcc)
          .then((response) => {
            if (response && response.status === 200) {
              const { isAuthenticated, object: { id } } = response.data;
              const { sessionToken } = credentials;
              const session = {
                provider: PROVIDER.GOOGLE,
                id,
                username: name,
                qz_token: sessionToken,
                qz_refresh_token: null,
                expiration: expires_in,
                isAuthenticated,
              };
              dispatch(setLoading(false));
              dispatch(storeUserSessionLogin(session));
              saveSession(session);
            }
          })
          .catch(() => {
            dispatch(setLoading(false));
            dispatch(storeUserSessionError(
              { message: 'Cannot forward GMAIL to Quezone service!' },
            ));
          });
      } else {
        dispatch(setLoading(false));
        dispatch(storeUserSessionError(
          { message: 'Access to GMAIL is unauthorized! Contact Quezone customer service for support!' },
        ));
      }
    })
    .catch((error) => {
      dispatch(storeUserSessionError({ message: error.message || 'Cannot login GMAIL account! Please try again!' }));
      dispatch(setLoading(false));
    });
};

export const googleLogIn = () => (dispatch) => {
  dispatch(setLoading(true));
  const ga = window.gapi[AUTH_METHOD].getAuthInstance();
  ga.signIn()
    .then((googleUser) => {
      getAWSCredentials(googleUser, dispatch);
    })
    .catch(
      () => {
        // user case: user trigger google account list popup but then closing
        // the popup without continuing login with Gmail.
        // @return {object} - { error: "popup_closed_by_user }
        dispatch(setLoading(false));
      },
    );
};

// Q-customer
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
                  dispatch(storeUserSessionLogin(session));
                  saveSession(session);
                }
                dispatch(setLoading(false));
              })
              .catch((error) => {
                dispatch(storeUserSessionError(error));
                dispatch(setLoading(false));
              });
          }
        } else {
          dispatch(storeUserSessionError('Topology Error'));
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        dispatch(storeUserSessionError(error));
        dispatch(setLoading(false));
      });
  };
};
