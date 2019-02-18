import { Auth } from 'aws-amplify';
import { GOOGLE_ID, AUTH_METHOD } from 'config/auth';
import BASE_URL from 'config/url';
import { setLoading } from 'actions/common';
import {
  LOGIN, STORE_EMAIL, STORE_USER_SUCCESS, STORE_USER_ERROR,
} from './constants';

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

const getAWSCredentials = async (googleUser) => {
  // eslint-disable-next-line
  const { id_token, expires_at } = googleUser.getAuthResponse();
  console.log('get AWS credentials token', id_token);
  console.log('get AWS credentials expires', expires_at);
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
  console.log('credentials', credentials);
  if (credentials) {
    console.log('Login G++ successful');
  } else {
    console.log('Cannot login Google+++');
  }
};

export const googleLogIn = () => {
  console.log('login with Google Account');
  return (dispatch) => {
    dispatch(setLoading(true));
    const ga = window.gapi[AUTH_METHOD].getAuthInstance();
    ga.signIn().then(
      async (googleUser) => {
        console.log('google user---', googleUser);
        await getAWSCredentials(googleUser);
        dispatch(setLoading(false));
      },
      (error) => {
        dispatch(setLoading(false));
        console.log('google signin error', error);
      },
    );
  };
};

// Login Actions

export const storeEmail = email => ({
  type: STORE_EMAIL,
  payload: { email },
});

export const storeUserSuccess = user => ({
  type: STORE_USER_SUCCESS,
  payload: { user },
});

export const storeUserError = error => ({
  type: STORE_USER_ERROR,
  payload: { error },
});

export const login = (value) => {
  console.log('value----', value);
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(storeEmail(value.email));
    Auth.signIn(value.email, value.password)
      .then((json) => {
        console.log('signIn json----', json);
        if (json) {
          localStorage.setItem('username', json.username);
          fetch(`${BASE_URL}/${LOGIN}/${json.username}`, {
            method: 'GET',
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          })
            .then(async (response) => {
              console.log('what is going on here!');
              const loginAuth = await response.json();
              console.log('loginAuth', loginAuth);
            })
            .then((data) => {
              dispatch(storeUserSuccess(data));
              localStorage.setItem('user', JSON.stringify(data));
              if (data.success === true) {
                console.log('User exists. Fetch the user details ans store in localStorage');
              } else {
                console.log('User logins for the first time. Navigate');
              }
              dispatch(setLoading(false));
            })
            .catch((error) => {
              dispatch(storeUserError(error));
              dispatch(setLoading(false));
              console.log('errror when login normal', error);
            });
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
