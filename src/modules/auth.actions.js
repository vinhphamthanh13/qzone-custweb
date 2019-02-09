import { Auth } from 'aws-amplify';
import { handleRequest } from 'api/helpers';
import { getCustomerByEmail, registerCustomer, loginCustomer } from 'api/auth';
import { loginType } from 'utils/constants';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';
export const SET_LOADING = 'AUTH.SET_LOADING';

const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

const loginError = error => ({
  type: LOGIN_FAILURE,
  payload: error ? error.message : 'Typology Error',
});

const loginSuccess = (payload, name) => {
  switch (name) {
    case loginType.GP: {
      const {
        data: {
          accessKeyId, isAuthenticated, Expiration, SessionToken,
        },
        config: { data },
      } = payload;
      return {
        type: LOGIN_SUCCESS,
        payload: {
          userAuthorized: isAuthenticated,
          accountName: JSON.parse(data).email,
          accessKeyId,
          Expiration,
          SessionToken,
        },
      };
    }
    default:
      return {
        type: LOGIN_SUCCESS,
        payload,
      };
  }
};

export const standardSignIn = (values) => {
  const { email, password } = values;
  return (dispatch) => {
    dispatch(setLoading(true));
    loginCustomer({ email, password })
      .then((response) => {
        dispatch(loginSuccess(response, ''));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(loginError(error));
        dispatch(setLoading(false));
      });
  };
};

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
  return (dispatch) => {
    dispatch(setLoading(true));
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
        dispatch(loginSuccess({ ...awsCredentials, ...customer }, loginType.GP));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(loginError(error));
        dispatch(setLoading(false));
      }
    });
  };
}

const registerUserSuccess = payload => ({
  type: REGISTER_SUCCESS,
  payload,
});


const registerUserFailure = payload => ({
  type: REGISTER_FAILURE,
  payload,
});

export function registerAWS(values) {
  return (dispatch) => {
    dispatch(setLoading(true));
    Auth.signUp({
      username: values.email,
      password: values.password,
      attributes: {
        email: values.email,
      },
      validationData: [],
    })
      .then(async (json) => {
        if (json) {
          dispatch(await registerCustomer({ ...values, ...json }, registerUserSuccess));
          dispatch(setLoading(false));
        } else {
          dispatch(registerUserFailure('Topology Error'));
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        dispatch(registerUserFailure(error));
        dispatch(setLoading(false));
      });
  };
}

export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE,
});
