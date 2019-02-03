import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT,
  RESET_ERROR_MESSAGE,
} from './auth.actions';

const authInitialize = {
  givenName: '',
  telephone: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: {
    city: '',
    country: '',
    district: '',
    postCode: '',
    state: '',
    streetAddress: '',
  },
  cognitoToken: '',
  familyName: '',
  userStatus: 'UNKNOWN',
  userSub: '',
  userAuthorized: false,
  registerErrorMessage: '',
  loginErrorMessage: '',
};

const auth = (state = authInitialize, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { userAuthorized, accountName } = action.payload;
      return {
        ...state,
        userAuthorized,
        accountName,
        loginErrorMessage: '',
      };
    }
    case REGISTER_SUCCESS: {
      const { status, data: { object, isAuthenticated } } = action.payload;
      return {
        ...authInitialize,
        userAuthorized: isAuthenticated && status === 200,
        registerPayload: object,
        registerErrorMessage: '',
      };
    }
    case REGISTER_FAILURE:
      return { ...authInitialize, registerErrorMessage: action.payload.message };
    case RESET_ERROR_MESSAGE:
      return { ...state, registerErrorMessage: '', loginErrorMessage: '' };
    case LOGIN_FAILURE:
      return { ...state, loginErrorMessage: action.payload };
    case LOGOUT:
    default:
      return authInitialize;
  }
};

export default auth;
