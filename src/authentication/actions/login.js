import { Auth } from 'aws-amplify';
import { get } from 'lodash';
import moment from 'moment';
import { FACEBOOK } from 'utils/constants';
import { GOOGLE_ID, AUTH_METHOD, PROVIDER } from 'config/auth';
import { setError, setLoading } from 'actionsReducers/common.actions';
import {
  getCustomerByEmail as loginApi,
  saveSocialUser,
  getCustomerById,
  storeAwsUser,
} from 'actionsApi/auth';
import { handleResponse, handleRequest, createHeaders } from 'utils/apiHelpers';
import {
  STORE_USER_SESSION_LOGIN,
  STORE_USER_SESSION_ERROR,
  SET_USER_DETAILS,
  SET_GUEST_ERROR,
  CLEAR_GUEST_ERROR,
  SET_CUSTOMER_BY_ID,
  USER_TYPE,
  UPDATE_AWS_USER,
  UPDATE_USER_INFO_STATUS,
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
export const setUserDetails = payload => ({
  type: SET_USER_DETAILS,
  payload,
});
const setCustomerByIdAction = payload => ({
  type: SET_CUSTOMER_BY_ID,
  payload,
});
const updateAwsUserAction = payload => ({
  type: UPDATE_AWS_USER,
  payload,
});
export const updateUserInfoStatusAction = payload => ({
  type: UPDATE_USER_INFO_STATUS,
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
const awsAuth = async (provider, { token, expires }, user, dispatch) => {
  const expiration = expires * 1000 + moment().unix() * 1000;
  const socialAccount = {
    cloudId: user.facebookId || user.googleId,
    givenName: user.name,
    email: user.email,
    userAccessToken: token,
    userType: USER_TYPE.CUSTOMER,
  };
  const [result, error] = await handleRequest(saveSocialUser, [socialAccount, null]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setUserDetails({
      ...result,
      givenName: user.name,
      authProvider: provider,
    }));
    dispatch(storeUserSessionLogin({
      authProvider: provider,
      start_session: moment().unix() * 1000,
      id: result.id,
      userName: user.name,
      providerToken: token,
      authHeaders: createHeaders(result.token),
      qz_token: result.token,
      qz_refresh_token: null,
      expiration,
      isAuthenticated: !!result.id,
    }));
  }
  dispatch(setLoading(false));
};
export const loginGoogle = () => async (dispatch) => {
  dispatch(setLoading(true));
  const ga = window.gapi[AUTH_METHOD].getAuthInstance();
  ga.signIn().then((response) => {
    const token = get(response.getAuthResponse(), 'id_token');
    const expires = get(response.getAuthResponse(), 'expires_in');
    const profile = response.getBasicProfile();
    const email = profile.getEmail();
    const name = profile.getName();
    const googleId = profile.getId();
    awsAuth(PROVIDER.GOOGLE, { token, expires }, { email, name, googleId }, dispatch);
  }).catch((error) => {
    dispatch(setError(`Cannot login with Google Account due to ${error.error}`));
    dispatch(setLoading(false));
  });
};
// Facebook login
const forwardFBUserToAWS = (provider, credentials, FB, dispatch) => {
  FB.api('/me', { fields: 'email, name, id'}, (response) => {
    const email = get(response, 'email');
    const name = get(response, 'name');
    const facebookId = get(response, 'id');
    awsAuth(provider, credentials, { name, email, facebookId }, dispatch);
  });
};
export const loginFacebook = (FB, preAuthResponse = null) => async (dispatch) => {
  dispatch(setLoading(true));
  if (!preAuthResponse) {
    FB.login(
      async (response) => {
        const status = get(response, 'status');
        if (status === FACEBOOK.STATUS.CONNECTED) {
          const authResponse = get(response, 'authResponse');
          const token = get(authResponse, 'accessToken');
          const expires = get(authResponse, 'expiresIn');
          forwardFBUserToAWS(PROVIDER.FACEBOOK, { token, expires }, FB, dispatch);
        }
        dispatch(setLoading(false));
      },
      { scope: 'public_profile, email' },
    );
  } else {
    const token = get(preAuthResponse, 'accessToken');
    const expires = get(preAuthResponse, 'expiresIn');
    forwardFBUserToAWS(PROVIDER.FACEBOOK, { token, expires }, FB, dispatch);
  }
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
          const { exp } = payload;
          if (payload.email_verified) {
            loginApi({ email }, jwtToken)
              .then((response) => {
                if (response.data.object) {
                  const resp = handleResponse(response);
                  const { objects, object } = resp;
                  const userDetail = objects || object;
                  const session = {
                    authProvider: PROVIDER.QUEZONE,
                    id: userDetail.id,
                    start_session: moment().unix() * 1000,
                    userName: userDetail.givenName,
                    qz_token: jwtToken,
                    qz_refresh_token: token,
                    expiration: exp * 1000, // AWS exp counted in second
                    isAuthenticated: !!get(response, 'data.object.userSub'),
                    authHeaders: createHeaders(jwtToken),
                  };
                  dispatch(storeUserSessionLogin(session));
                  dispatch(setUserDetails({ ...userDetail, authProvider: PROVIDER.QUEZONE }));
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
        dispatch(setError(error.message));
        dispatch(storeUserSessionError(error));
        dispatch(setLoading(false));
      });
  };
};
export const setGuestErrorAction = () => ({
  type: SET_GUEST_ERROR,
});
export const clearGuestErrorAction = () => ({
  type: CLEAR_GUEST_ERROR,
});
export const saveGuestInfo = (data, callback) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(saveSocialUser, [data]);
  if (error) {
    dispatch(setError(error));
    dispatch(setGuestErrorAction());
  } else {
    const session = {
      authProvider: PROVIDER.QUEZONE,
      id: get(result, 'userSub') || get(result, 'id'),
      start_session: moment().unix() * 1000,
      userName: get(result, 'fullName') || get(result, 'givenName'),
      qz_token: null,
      qz_refresh_token: null,
      expiration: moment().add(1, 'd').unix() * 1000, // AWS exp counted in second
      isAuthenticated: !!get(result, 'userSub') || !!get(result, 'id'),
      authHeaders: createHeaders(result.token),
    };
    dispatch(storeUserSessionLogin(session));
    dispatch(setUserDetails({ ...result, authProvider: PROVIDER.QUEZONE }));
    callback();
  }
  dispatch(setLoading(false));
};
export const getCustomerByIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(getCustomerById, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setCustomerByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const updateAwsUserApi = (data, headers) => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(storeAwsUser, [data, headers]);
  if (error) {
    dispatch(setError(error));
    dispatch(updateUserInfoStatusAction(false));
  } else {
    dispatch(updateAwsUserAction(result));
    dispatch(updateUserInfoStatusAction(true));
  }
  dispatch(setLoading(false));
};
