import {
  SET_LOADING,
  RESET_ERROR_MESSAGE,
} from 'actions/common';
import {
  STORE_EMAIL,
  STORE_USER_ERROR,
  STORE_USER_SUCCESS,
  REGISTER_AWS_ERROR,
  REGISTER_AWS_SUCCESS,
  CONFIRM_SIGNUP_ERROR,
  HANDLE_VERIFICATION_MODAL,
  CONFIRM_SIGNUP_SUCCESS,
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
  userAuthorized: false,
  registerErrorMessage: '',
  loginErrorMessage: '',
  isLoading: false,
  isVerificationCode: false,
  iSignUpSuccess: false,
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
    case 'RESEND_VERIFICATION_CODE':
    case 'USER_AUTHENTICATED':
      return {
        ...state,
        isVerificationCode: false,
      };
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
        isVerificationCode: false,
      };
    }
    case STORE_USER_ERROR:
      return {
        ...authInitialize,
        registerErrorMessage: action.payload.message,
        isVerificationCode: false,
      };
    case RESET_ERROR_MESSAGE:
      return {
        ...state,
        registerErrorMessage: '',
        loginErrorMessage: '',
        verificationErrorMessage: '',
      };
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
