import { Auth } from 'aws-amplify';
import { setLoading } from 'actions/common';
import {
  REGISTER_AWS_SUCCESS, REGISTER_AWS_ERROR,
  CONFIRM_SIGNUP_SUCCESS, CONFIRM_SIGNUP_ERROR,
  HANDLE_VERIFICATION_MODAL, CLOSE_REGISTER_SUCCESS_MODAL,
} from './constants';

const registerAwsSuccess = payload => ({
  type: REGISTER_AWS_SUCCESS,
  payload,
});

const registerAwsError = payload => ({
  type: REGISTER_AWS_ERROR,
  payload,
});

export const register = (user) => {
  const {
    password, email,
  } = user;
  console.log('user when register', user);
  return (dispatch) => {
    dispatch(setLoading(true));
    Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        // phone_number: telephone,
      },
      validationData: [],
    })
      .then((data) => {
        console.log('data after reg AWS success', data);
        dispatch(registerAwsSuccess({ ...user, ...data }));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(registerAwsError(error));
        dispatch(setLoading(false));
      });
  };
};

const confirmSignUpSuccess = payload => ({
  type: CONFIRM_SIGNUP_SUCCESS,
  payload,
});

const confirmSignUpError = payload => ({
  type: CONFIRM_SIGNUP_ERROR,
  payload,
});

const handleVerificationCodeModal = payload => ({
  type: HANDLE_VERIFICATION_MODAL,
  payload,
});

const handleCloseRegisterSuccessModal = () => ({
  type: CLOSE_REGISTER_SUCCESS_MODAL,
});

export const closeRegisterSuccessModal = () => (dispatch) => {
  dispatch(handleCloseRegisterSuccessModal());
};

export const reEnterVerificationCode = () => (dispatch) => {
  dispatch(handleVerificationCodeModal(true));
};

export const confirmSignUp = ({ email, code }) => {
  console.log('send confirm code', email, ' and ', code);
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(handleVerificationCodeModal(false));
    Auth.confirmSignUp(email, code, { forceAliasCreation: true })
      .then((data) => {
        console.log('data confirmSignUp', data); // data return 'SUCCESS'
        dispatch(confirmSignUpSuccess(data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.log('error confirmSignUp', error);
        dispatch(confirmSignUpError(error)); // error returns object { code, message, }
        dispatch(setLoading(false));
      });
  };
};
