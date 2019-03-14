import { Auth } from 'aws-amplify';
import { setLoading } from 'actions/common';
import { catchAwsUser } from 'api/auth';
import {
  REGISTER_AWS_SUCCESS, REGISTER_AWS_ERROR, CONFIRM_SIGN_UP_SUCCESS, CONFIRM_SIGN_UP_ERROR,
  HANDLE_VERIFICATION_MODAL, CLOSE_REGISTER_SUCCESS_MODAL, RESEND_VERIFICATION_CODE_STATUS,
  TOGGLE_RESET_PASSWORD_DIALOG, RESET_PASSWORD_STATUS,
} from './constants';

const registerAwsSuccess = payload => ({
  type: REGISTER_AWS_SUCCESS,
  payload,
});

const registerAwsError = payload => ({
  type: REGISTER_AWS_ERROR,
  payload,
});

export const register = user => (dispatch) => {
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
      dispatch(registerAwsSuccess({ ...user, ...data }));
      dispatch(setLoading(false));
    })
    .catch((error) => {
      dispatch(registerAwsError(error));
      dispatch(setLoading(false));
    });
};

const confirmSignUpSuccess = payload => ({
  type: CONFIRM_SIGN_UP_SUCCESS,
  payload,
});

const confirmSignUpError = payload => ({
  type: CONFIRM_SIGN_UP_ERROR,
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

export const confirmSignUp = ({ userDetails, code }) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(handleVerificationCodeModal(false));
  const { email } = userDetails;
  Auth.confirmSignUp(email, code, { forceAliasCreation: true })
    .then((data) => {
      const trackedInfo = {
        ...userDetails,
        userStatus: 'CONFIRMED',
        userType: 'CUSTOMER',
      };
      catchAwsUser(trackedInfo).then(
        () => {
          dispatch(confirmSignUpSuccess(data));
          dispatch(setLoading(false));
        },
      ).catch((error) => {
        dispatch(setLoading(false));
        dispatch(confirmSignUpError(error)); // error returns object { code, message, }
      });
    })
    .catch((error) => {
      dispatch(confirmSignUpError(error)); // error returns object { code, message, }
      dispatch(setLoading(false));
    });
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
  // eslint-disable-next-line
  const { email, code, new_password } = values;
  Auth.forgotPasswordSubmit(email, code, new_password)
    .then(() => {
      dispatch(setLoading(false));
      dispatch(handleResetPasswordStatus({
        status: 'success',
        message: 'Password is reset successfully! Enjoy your new login',
      }));
      dispatch(toggleResetPassword(false));
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(handleResetPasswordStatus({
        status: 'error',
        message: error.message,
      }));
      dispatch(toggleResetPassword(false));
    });
};

export const clearResetPasswordStatus = () => ({
  type: RESET_PASSWORD_STATUS,
  payload: {
    status: 'none',
    message: '',
  },
});
