import {
  SET_LOADING,
  RESET_ERROR_MESSAGE,
} from 'actions/common';
import {
  STORE_EMAIL,
  STORE_USER_SUCCESS,
  STORE_USER_ERROR,
} from './constants';

const authInitialize = {
  userDetails: {
    givenName: '',
    familyName: '',
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
  },
  cognitoToken: '',
  userStatus: 'UNKNOWN',
  userSub: '',
  userAuthorized: false,
  registerErrorMessage: '',
  loginErrorMessage: '',
  isLoading: false,
};

const auth = (state = authInitialize, action) => {
  switch (action.type) {
    case STORE_EMAIL: {
      return {
        ...state,
        email: action.payload.email,
        loginErrorMessage: '',
      };
    }
    case STORE_USER_SUCCESS: {
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          ...action.payload.user,
        },
        registerErrorMessage: '',
      };
    }
    case STORE_USER_ERROR:
      return { ...authInitialize, registerErrorMessage: action.payload.message };
    case RESET_ERROR_MESSAGE:
      return { ...state, registerErrorMessage: '', loginErrorMessage: '' };
    case SET_LOADING: {
      console.log('isLoading', action.payload);
      return { ...state, isLoading: action.payload };
    }
    // case LOGOUT:
    default:
      return authInitialize;
  }
};

export default auth;
