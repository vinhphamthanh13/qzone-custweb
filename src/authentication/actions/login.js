import { Auth } from 'aws-amplify';
import { get } from 'lodash';
import moment from 'moment';
import { GOOGLE_ID, AUTH_METHOD, PROVIDER } from 'config/auth';
import { setError, setLoading } from 'actionsReducers/common.actions';
import {
  getCustomerByEmail as loginApi,
  saveSocialEmail as socialLoginApi,
  fetchUserDetail,
  firebaseStoreUser,
} from 'actionsApi/auth';
import { handleResponse, handleRequest } from 'utils/apiHelpers';
import {
  STORE_USER_SESSION_LOGIN,
  STORE_USER_SESSION_ERROR,
  SET_USER_DETAILS,
  FIRE_BASE_STORE_USER,
  AUTHENTICATED_KEY,
} from './constants';

// Redux
export const storeUserSessionLogin = payload => ({
  type: STORE_USER_SESSION_LOGIN,
  payload,
});

const storeUserSessionError = payload => ({
  type: STORE_USER_SESSION_ERROR,
  payload,
});

const setUserDetails = payload => ({
  type: SET_USER_DETAILS,
  payload,
});

export const storeFireBaseUser = payload => ({
  type: FIRE_BASE_STORE_USER,
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
              const resp = handleResponse(response);
              const { objects, object } = resp;
              const userDetail = objects || object;
              const { sessionToken } = credentials;
              const session = {
                authProvider: PROVIDER.GOOGLE,
                start_session: moment().unix() * 1000,
                id: userDetail.id,
                username: name,
                qz_token: sessionToken,
                qz_refresh_token: null,
                expiration: expires_in,
                isAuthenticated: get(response, `data.${AUTHENTICATED_KEY}`),
              };
              dispatch(setLoading(false));
              dispatch(storeUserSessionLogin(session));
              dispatch(setUserDetails(userDetail));
              // saveSession(session);
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

// Facebook login
export const facebookLogIn = () => (dispatch) => {
  dispatch(setLoading(true));
  setTimeout(() => {
    alert('Login FaceBook');
    dispatch(setLoading(false));
  }, 3000);
};

// receive Push Notification
export const storeFireBaseUserAction = async (data, dispatch) => {
  dispatch(setLoading(true));
  const [firebaseUserStored, error] = await handleRequest(firebaseStoreUser, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(storeFireBaseUser(firebaseUserStored || 'success'));
  }
  dispatch(setLoading(false));
};

// const askFireBaseUserToken = async () => askForPermissionToReceiveNotifications();

// Q-customer
export const login = (value) => {
  const { email, password } = value;
  return async (dispatch) => {
    dispatch(setLoading(true));
    Auth.signIn(email, password)
      .then((json) => {
        if (json) {
          const { idToken: { jwtToken, payload }, refreshToken: { token } } = json.signInUserSession;
          const { exp } = payload;
          if (payload.email_verified) {
            loginApi({ email })
              .then((response) => {
                if (response.data.object) {
                  const resp = handleResponse(response);
                  const { objects, object } = resp;
                  const userDetail = objects || object;
                  const session = {
                    authProvider: PROVIDER.QUEZONE,
                    id: userDetail.id,
                    start_session: moment().unix() * 1000,
                    username: userDetail.givenName,
                    qz_token: jwtToken,
                    qz_refresh_token: token,
                    expiration: exp * 1000, // AWS exp counted in second
                    isAuthenticated: !!get(response, 'data.object.userSub'),
                  };
                  // askFireBaseUserToken().then(userToken => storeFireBaseUserAction({
                  //   email,
                  //   userToken,
                  // }, dispatch));
                  dispatch(storeUserSessionLogin(session));
                  dispatch(setUserDetails(userDetail));
                  // saveSession(session);
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

export const getUserDetail = userId => async (dispatch) => {
  dispatch(setLoading(true));
  const [userDetail] = await handleRequest(fetchUserDetail, [userId], [{}]);
  if (userDetail && !userDetail.success) {
    dispatch(setError(userDetail.message));
  } else {
    dispatch(setUserDetails(userDetail));
  }
  dispatch(setLoading(false));
};
