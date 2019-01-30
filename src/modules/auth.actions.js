import { Auth } from 'aws-amplify';
import { handleRequest } from 'api/helpers';
import { getCustomerByEmail } from 'api/auth';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';

export function login(payload) {
  return { type: LOGIN_SUCCESS, payload };
}

export function logout() {
  return { type: LOGOUT };
}

export function facebookSignIn() {
  return () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        window.FB.api('/me', (data) => {
          console.log(`Good to see you, ${data.name}.`);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email,user_likes' });
  };
}

export function googleSignIn() {
  return () => {
    window.gapi.load('auth2', async () => {
      try {
        await window.gapi.auth2.init({
          client_id: '1075505092107-j8821j05r48pco773m0mqb16g1po5gtj.apps.googleusercontent.com',
        });
        const ga = window.gapi.auth2.getAuthInstance();
        const googleUser = await ga.signIn();
        // eslint-disable-next-line camelcase
        const { id_token, expires_at } = googleUser.getAuthResponse();
        const profile = googleUser.getBasicProfile();
        const user = {
          email: profile.getEmail(),
          name: profile.getName(),
        };

        const [awsCredentials, customer] = await Promise.all([
          Auth.federatedSignIn(
            'google',
            { token: id_token, expires_at },
            { email: user.email },
          ),
          handleRequest(getCustomerByEmail, { email: user.email }),
        ]);
        console.log('get aws credentials', awsCredentials);
        console.log('get customer', customer);
      } catch (error) {
        // console.log('googleSignIn error', error);
      }
    });
  };
}


function registerUserSuccess(payload) {
  return {
    type: REGISTER_USER_SUCCESS,
    payload,
  };
}

function registerUserFailure(payload) {
  return {
    type: REGISTER_USER_FAILURE,
    payload,
  };
}

export function register(values) {
  return (dispatch) => {
    Auth.signUp({
      username: values.email,
      password: values.pwd,
      attributes: {
        email: values.email,
      },
      validationData: [],
    })
      .then((json) => {
        if (json) {
          dispatch(registerUserSuccess(json));
        } else {
          dispatch(registerUserFailure('Topology Error'));
        }
        return json;
      })
      .catch(err => dispatch(registerUserFailure(err)));
  };
}
