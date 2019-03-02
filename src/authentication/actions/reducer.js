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
  RESEND_VERIFICATION_CODE_STATUS,
  LOGOUT_SUCCESS,
  TOGGLE_RESET_PASSWORD_DIALOG,
  RESET_PASSWORD_STATUS,
  LOAD_SESSION_TO_STATE,
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
  resendVerificationCodeStatus: 'none', // success, error, none
  iSignUpSuccess: false,
  loginSession: {
    isAuthenticated: false,
  },
  isForgotPassword: false,
  resetPasswordStatus: 'none', // success, error, none
  resetPasswordMessage: '',
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
    case RESEND_VERIFICATION_CODE_STATUS: {
      const isVerificationCode = action.payload === 'none';
      return {
        ...state,
        resendVerificationCodeStatus: action.payload,
        isVerificationCode,
      };
    }
    case STORE_USER_LOGIN: {
      return {
        ...state,
        loginSession: action.payload,
        loginErrorMessage: '',
      };
    }
    case STORE_USER_ERROR: {
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
    case TOGGLE_RESET_PASSWORD_DIALOG:
      return {
        ...state,
        isForgotPassword: action.payload,
      };
    case RESET_PASSWORD_STATUS:
      return {
        ...state,
        resetPasswordStatus: action.payload.status,
        resetPasswordMessage: action.payload.message,
      };
    case LOAD_SESSION_TO_STATE:
      return {
        ...state,
        loginSession: action.payload,
      };
    case LOGOUT_SUCCESS:
      return authInitialize;
    default:
      return state;
  }
};

export default auth;
