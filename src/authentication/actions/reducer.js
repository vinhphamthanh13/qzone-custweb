import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  SET_LOADING,
  RESET_MODAL_STATUS,
} from 'actionsReducers/common.actions';
import {
  STORE_USER_SESSION_LOGIN,
  STORE_USER_SESSION_ERROR,
  REGISTER_AWS_ERROR,
  REGISTER_AWS_SUCCESS,
  CONFIRM_SIGN_UP_ERROR,
  HANDLE_VERIFICATION_MODAL,
  CONFIRM_SIGN_UP_SUCCESS,
  CLOSE_REGISTER_SUCCESS_MODAL,
  RESEND_VERIFICATION_CODE_STATUS,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
  TOGGLE_RESET_PASSWORD_DIALOG,
  RESET_PASSWORD_STATUS,
  LOAD_SESSION_TO_STATE,
  SET_USER_DETAILS, LOGOUT_ERROR_RST,
  FIRE_BASE_STORE_USER,
  AUTHENTICATED_KEY,
  SET_GUEST_ERROR,
  CLEAR_GUEST_ERROR,
} from './constants';


const persistConfig = {
  key: 'auth',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    'cognitoToken',
    'registerErrorMessage',
    'loginErrorMessage',
    'isVerificationCode',
    'resendVerificationCodeStatus',
    'iSignUpSuccess',
    'isForgotPassword',
    'resetPasswordStatus',
    'resetPasswordMessage',
    'isLogoutError',
    'firebaseUserStored',
    'facebookToken',
    'guestUserError',
  ],
};

const authInitialize = {
  userDetail: null,
  cognitoToken: '',
  registerErrorMessage: '',
  loginErrorMessage: '',
  isLoading: false,
  isVerificationCode: false,
  resendVerificationCodeStatus: 'none', // success, error, none
  iSignUpSuccess: false,
  loginSession: null,
  isForgotPassword: false,
  resetPasswordStatus: 'none', // success, error, none
  resetPasswordMessage: '',
  isLogoutError: false,
  firebaseUserStored: null,
  guestUserError: false,
};

const reducer = (state = authInitialize, action) => {
  switch (action.type) {
    case REGISTER_AWS_ERROR:
      return {
        ...state,
        isVerificationCode: false,
        registerErrorMessage: action.payload.message || 'Register AWS failed',
      };
    case REGISTER_AWS_SUCCESS:
      return {
        ...state,
        userDetail: action.payload,
        isVerificationCode: true,
      };
    case CONFIRM_SIGN_UP_ERROR:
      return {
        ...state,
        isVerificationCode: false,
        verificationErrorMessage: action.payload.message,
      };
    case CONFIRM_SIGN_UP_SUCCESS:
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
    case STORE_USER_SESSION_LOGIN:
      return {
        ...state,
        loginSession: action.payload,
        loginErrorMessage: '',
      };
    case STORE_USER_SESSION_ERROR:
      return {
        ...state,
        loginSession: {
          [AUTHENTICATED_KEY]: false,
        },
        loginErrorMessage: action.payload.message,
      };
    case RESET_MODAL_STATUS:
      return {
        ...state,
        registerErrorMessage: '',
        loginErrorMessage: '',
        verificationErrorMessage: '',
      };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
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
    case LOGOUT_ERROR:
      return {
        ...state,
        isLogoutError: true,
        logoutErrorMessage: action.payload.message || 'There is error occur! Try again.',
      };
    case LOGOUT_ERROR_RST:
      return {
        ...state,
        isLogoutError: false,
        logoutErrorMessage: '',
      };
    case SET_USER_DETAILS:
      return {
        ...state,
        userDetail: action.payload,
      };
    case FIRE_BASE_STORE_USER:
      return {
        ...state,
        firebaseUserStored: action.payload,
      };
    case SET_GUEST_ERROR:
      return {
        ...state,
        guestUserError: true,
      };
    case CLEAR_GUEST_ERROR:
      return {
        ...state,
        guestUserError: false,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
