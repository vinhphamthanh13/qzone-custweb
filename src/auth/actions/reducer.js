import {
  SET_LOADING,
  RESET_ERROR_MESSAGE,
} from 'actions/common';
import {
  STORE_USER_LOGIN,
  STORE_USER_ERROR,
  REGISTER_AWS_ERROR,
  REGISTER_AWS_SUCCESS,
  CONFIRM_SIGNUP_ERROR,
  HANDLE_VERIFICATION_MODAL,
  CONFIRM_SIGNUP_SUCCESS,
  CLOSE_REGISTER_SUCCESS_MODAL,
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
    userStatus: 'UNKNOWN',
  },
  cognitoToken: '',
  registerErrorMessage: '',
  loginErrorMessage: '',
  isLoading: false,
  isVerificationCode: false,
  iSignUpSuccess: false,
  loginSession: {
    isAuthenticated: false,
  },
};

const auth = (state = authInitialize, action) => {
  switch (action.type) {
    case REGISTER_AWS_SUCCESS: {
      return {
        ...state,
        userDetails: action.payload,
        isVerificationCode: true,
      };
    }
    case REGISTER_AWS_ERROR:
      return {
        ...state,
        isVerificationCode: false,
        registerErrorMessage: action.payload.message || 'Register AWS failed',
      };
    case CONFIRM_SIGNUP_ERROR:
      return {
        ...state,
        isVerificationCode: false,
        verificationErrorMessage: action.payload.message,
      };
    case CONFIRM_SIGNUP_SUCCESS:
      return {
        ...state,
        isVerificationCode: false,
        iSignUpSuccessModal: true,
      };
    case HANDLE_VERIFICATION_MODAL:
      return {
        ...state,
        isVerificationCode: action.payload,
        verificationErrorMessage: '',
      };
    case CLOSE_REGISTER_SUCCESS_MODAL:
      return {
        ...state,
        iSignUpSuccessModal: false,
      };
    case STORE_USER_LOGIN: {
      return {
        ...state,
        loginSession: {
          token: action.payload.token,
          expiration: action.payload.expiration,
          userName: action.payload.userName,
          isAuthenticated: action.payload.isAuthenticated,
        },
        loginErrorMessage: '',
      };
    }
    case STORE_USER_ERROR: {
      console.log('storeuser error', state);
      return {
        ...state,
        loginSession: {
          isAuthenticated: false,
        },
        loginErrorMessage: action.payload.message,
      };
    }
    case RESET_ERROR_MESSAGE:
      return {
        ...state,
        registerErrorMessage: '',
        loginErrorMessage: '',
        verificationErrorMessage: '',
      };
    case SET_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    // case LOGOUT:
    default:
      return authInitialize;
  }
};

export default auth;
