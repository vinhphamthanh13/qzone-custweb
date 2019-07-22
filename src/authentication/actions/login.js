import { Auth } from 'aws-amplify';
import { get } from 'lodash';
import moment from 'moment';
import { FACEBOOK } from 'utils/constants';
import {
  GOOGLE_ID,
  AUTH_METHOD,
  PROVIDER,
} from 'config/auth';
import {
  setError,
  setLoading,
} from 'actionsReducers/common.actions';
import {
  getCustomerByEmail as loginApi,
  saveSocialUser,
  fetchUserDetail,
  firebaseStoreUser,
} from 'actionsApi/auth';
import {
  handleResponse,
  handleRequest,
} from 'utils/apiHelpers';
import {
  STORE_USER_SESSION_LOGIN,
  STORE_USER_SESSION_ERROR,
  SET_USER_DETAILS,
  FIRE_BASE_STORE_USER,
  SET_GUEST_ERROR,
  CLEAR_GUEST_ERROR,
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

const awsAuth = (provider, { token, expires }, user, dispatch) => {
  const expiration = expires * 1000 + moment().unix() * 1000;
  console.log('aws auth federated', provider);
  console.log('aws auth federated token', token);
  console.log('aws auth federated expires', expires);
  console.log('aws auth federated user', user);
  Auth.federatedSignIn(
    provider,
    { token, expires_at: expiration },
    user,
  ).then(async (credential) => {
    const socialAccount = {
      email: user.email,
      userType: 'CUSTOMER',
    };
    const [result, error] = await handleRequest(saveSocialUser, [socialAccount]);
    if (error) {
      dispatch(setError(error));
    } else {
      dispatch(setUserDetails({
        ...result,
        givenName: user.name,
      }));
      dispatch(storeUserSessionLogin({
        authProvider: provider,
        start_session: moment().unix() * 1000,
        id: result.id,
        userName: user.name,
        givenName: user.name,
        qz_token: credential.sessionToken,
        qz_refresh_token: null,
        expiration,
        isAuthenticated: !!result.id,
      }));
    }
    dispatch(setLoading(false));
  }).catch((error) => {
    console.log('login federation failed', error);
    dispatch(setError(`Login fail with ${provider}`));
    dispatch(setLoading(false));
  });
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
    awsAuth(PROVIDER.GOOGLE, { token, expires }, { email, name }, dispatch);
  }).catch((error) => {
    dispatch(setError(error));
    dispatch(setLoading(false));
  });
};

// Facebook login

const forwardFBUserToAWS = (provider, credentials, FB, dispatch) => {
  FB.api('/me', { fields: 'email, name' }, (response) => {
    const email = get(response, 'email');
    const name = get(response, 'name');
    awsAuth(provider, credentials, { name, email }, dispatch);
  });
};

export const loginFacebook = (FB, preAuthResponse = null) => async (dispatch) => {
  dispatch(setLoading(true));
  if (!preAuthResponse) {
    FB.login(
      async (response) => {
        const status = get(response, 'status');
        console.log('now login facbook fresh', response);
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
    console.log('face book acc already logged in', preAuthResponse);
    const token = get(preAuthResponse, 'accessToken');
    const expires = get(preAuthResponse, 'expiresIn');
    forwardFBUserToAWS(PROVIDER.FACEBOOK, { token, expires }, FB, dispatch);
  }
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

// Q GUEST

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
      username: get(result, 'fullName') || get(result, 'givenName'),
      qz_token: null,
      qz_refresh_token: null,
      expiration: moment().add(1, 'd').unix() * 1000, // AWS exp counted in second
      isAuthenticated: !!get(result, 'userSub') || !!get(result, 'id'),
    };
    dispatch(storeUserSessionLogin(session));
    dispatch(setUserDetails(result));
    callback();
  }
  dispatch(setLoading(false));
};
