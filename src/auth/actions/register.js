import { Auth } from 'aws-amplify';
import { setLoading } from 'actions/common';
import {
  REGISTER_AWS_SUCCESS, REGISTER_AWS_ERROR, CONFIRM_SIGNUP_SUCCESS, CONFIRM_SIGNUP_ERROR,
  HANDLE_VERIFICATION_MODAL, CLOSE_REGISTER_SUCCESS_MODAL,
  RESEND_VERIFICATION_CODE_STATUS, TOGGLE_RESET_PASSWORD_DIALOG, RESET_PASSWORD_STATUS,
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
  console.log('user when register', user);
  return (dispatch) => {
    dispatch(setLoading(true));
    Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        'custom:user_type': 'CUSTOMER',
        phone_number: user.telephone,
        given_name: user.givenName,
        preferred_username: 'CUSTOMER',
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

const resendCodeStatus = payload => ({
  type: RESEND_VERIFICATION_CODE_STATUS,
  payload,
});

export const resendCode = email => (dispatch) => {
  dispatch(setLoading(true));
  Auth.resendSignUp(email)
    .then(() => {
      dispatch(resendCodeStatus('success'));
      dispatch(setLoading(false));
    })
    .catch(() => {
      dispatch(resendCodeStatus('error'));
      dispatch(setLoading(false));
    });
};

export const resetResendVerificationCodeModal = () => dispatch => dispatch(resendCodeStatus('none'));

export const toggleResetPassword = payload => ({
  type: TOGGLE_RESET_PASSWORD_DIALOG,
  payload,
});

export const handleResetPasswordStatus = payload => ({
  type: RESET_PASSWORD_STATUS,
  payload,
});

export const forgotPassword = email => (dispatch) => {
  dispatch(setLoading(true));
  Auth.forgotPassword(email)
    .then(() => {
      /* @return {object} - CodeDeliveryDetails {} */
      dispatch(toggleResetPassword(true));
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log('error after send forgot', error);
      dispatch(toggleResetPassword(false));
      dispatch(setLoading(false));
      dispatch(handleResetPasswordStatus({
        status: 'error',
        message: error.message || 'Cannot request reset password at the moment!',
      }));
    });
};

export const forgotPasswordSubmit = values => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(toggleResetPassword(false));
  // eslint-disable-next-line
  const { email, code, new_password } = values;
  Auth.forgotPasswordSubmit(email, code, new_password)
    .then(() => {
      dispatch(setLoading(false));
      dispatch(handleResetPasswordStatus({
        status: 'success',
        message: 'Password is reset successfully',
      }));
      dispatch(toggleResetPassword(false));
    })
    .catch((error) => {
      console.log('error', error);
      dispatch(setLoading(false));
      dispatch(toggleResetPassword(false));
      dispatch(handleResetPasswordStatus({
        status: 'error',
        message: 'Cannot reset your password! Please try again',
      }));
    });
};

export const clearResetPasswordStatus = () => ({
  type: RESET_PASSWORD_STATUS,
  payload: {
    status: 'none',
    message: '',
  },
});
