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
  policyAgreement: false,
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
  errorMessage: '',
};

const auth = (state = authInitialize, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userAuthorized: action.payload,
        errorMessage: '',
      };
    case REGISTER_SUCCESS:
      return {
        ...authInitialize,
        userStatus: 'CONFIRMED',
        userAuthorized: true,
        payload: action.payload,
        errorMessage: '',
      };
    case REGISTER_FAILURE:
      return { ...authInitialize, errorMessage: action.payload.message };
    case RESET_ERROR_MESSAGE:
      return { ...state, errorMessage: '' };
    case LOGIN_FAILURE:
    case LOGOUT:
    default:
      return authInitialize;
  }
};

export default auth;
