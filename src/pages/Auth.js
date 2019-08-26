import React, { Component } from 'react';
import {
  bool, func, string,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import Register from 'authentication/Register';
import Login from 'authentication/Login';
import VerificationCode from 'authentication/components/VerificationCode';
import CustomModal from 'components/Modal/CustomModal';
import { logout } from 'authentication/actions/logout';
import {
  reEnterVerificationCode, closeRegisterSuccessModal, resetResendVerificationCodeModal,
  clearResetPasswordStatus,
} from 'authentication/actions/register';
import ForgotPasswordForm from 'authentication/components/ForgotPasswordForm';
import { login as autoLogin } from 'authentication/actions/login';
import {
  SESSION,
} from 'utils/constants';

class Auth extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      loginSession,
      userDetail,
      isForgotPassword,
    } = props;
    const {
      loginSession: cachedLoginSession,
      userDetail: cachedUserDetail,
      isForgotPassword: cisForgotPassword,
    } = state;
    if (
      loginSession !== cachedLoginSession
      || userDetail !== cachedUserDetail
      || isForgotPassword.value !== cisForgotPassword.value
    ) {
      return {
        loginSession,
        userDetail,
        isForgotPassword,
      };
    }
    return null;
  }

  state = {
    isSessionTimeout: false,
    loginSession: null,
    userDetail: null,
    isForgotPassword: { value: null },
  };

  componentDidUpdate() {
    const {
      loginSession,
    } = this.state;
    const expiration = get(loginSession, 'expiration');
    if (moment().isAfter(moment(expiration))) {
      this.handleLogout();
    }
  }

  handleReEnterVerificationCode = () => {
    const { reEnterVerificationCodeAction } = this.props;
    reEnterVerificationCodeAction();
  };

  handleCloseRegisterSuccessModal = () => {
    const {
      closeRegisterSuccessModalAction,
      autoLoginAction,
    } = this.props;
    const { userDetail } = this.state;
    const email = get(userDetail, 'email');
    const password = get(userDetail, 'password');
    closeRegisterSuccessModalAction();
    autoLoginAction({ email, password });
  };

  handleCloseResendStatusModal = () => {
    const { closeResendStatusModal } = this.props;
    closeResendStatusModal();
  };

  handleCloseResetPasswordModal = () => {
    const { clearResetPasswordStatusAction } = this.props;
    clearResetPasswordStatusAction();
  };

  handleLogout = () => {
    const { logoutAction, onReloadApp } = this.props;
    const { loginSession } = this.state;
    const { isAuthenticated, authProvider } = loginSession;
    this.setState({ isSessionTimeout: true });
    logoutAction({
      isAuthenticated,
      authProvider,
    });
    onReloadApp();
  };

  handlePopupLogin = () => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate('isLoginOpen');
    this.setState({ isSessionTimeout: false });
  };

  render() {
    const {
      isRegisterOpen,
      isLoginOpen,
      closeDialog,
      isVerificationCode,
      verificationErrorMessage,
      iSignUpSuccessModal,
      resendVerificationCodeStatus,
      handleAuthenticate,
      resetPasswordStatus,
      resetPasswordMessage,
    } = this.props;
    const {
      isForgotPassword,
      isSessionTimeout,
      userDetail,
    } = this.state;
    const email = get(userDetail, 'email');
    const renderSessionTimeout = isSessionTimeout
      ? (
        <CustomModal
          type="error"
          title={SESSION.EXPIRED.title}
          message={SESSION.EXPIRED.message}
          isOpen
          okButton
          okCallBack={this.handlePopupLogin}
        />) : null;
    const verificationCodeModal = isVerificationCode ? <VerificationCode /> : null;
    const errorModal = verificationErrorMessage ? (
      <CustomModal
        type="error"
        isOpen
        title="Verification Error"
        message="Verification code is not valid! Try again"
        onClose={this.handleReEnterVerificationCode}
      />
    ) : null;
    const successModal = iSignUpSuccessModal ? (
      <CustomModal
        type="info"
        isOpen
        title="Registration succeed!"
        message={`Enjoy your experience at Quezone! ${email.split('').slice(0, 27).join('')}...`}
        okCallBack={this.handleCloseRegisterSuccessModal}
      />
    ) : null;
    let resendModal;
    if (resendVerificationCodeStatus === 'success') {
      resendModal = (
        <CustomModal
          type="info"
          isOpen
          title="Resending Code Success"
          message="Verification code is resent to your email!"
          onClose={this.handleCloseResendStatusModal}
        />
      );
    } else if (resendVerificationCodeStatus === 'error') {
      resendModal = (
        <CustomModal
          type="error"
          isOpen
          title="Resending Code Error"
          message="Cannot get contact the server to get new verification code"
          onClose={this.handleCloseResendStatusModal}
        />
      );
    } else {
      resendModal = null;
    }
    let resetPasswordModal;
    if (resetPasswordStatus === 'success') {
      resetPasswordModal = (
        <CustomModal
          type="info"
          isOpen
          title="Password Reset Success"
          message={resetPasswordMessage}
          onClose={this.handleCloseResetPasswordModal}
        />
      );
    } else if (resetPasswordStatus === 'error') {
      resetPasswordModal = (
        <CustomModal
          type="error"
          isOpen
          title="Password Reset Error"
          message={resetPasswordMessage}
          onClose={this.handleCloseResetPasswordModal}
        />
      );
    } else {
      resetPasswordModal = null;
    }

    return (
      <>
        {renderSessionTimeout}
        {verificationCodeModal}
        {errorModal}
        {successModal}
        {resendModal}
        {resetPasswordModal}
        {isForgotPassword.value && <ForgotPasswordForm />}
        <Register
          isOpen={isRegisterOpen}
          onClose={() => closeDialog('isRegisterOpen')}
          handleAuthenticate={handleAuthenticate}
        />
        <Login
          isOpen={isLoginOpen}
          onClose={() => closeDialog('isLoginOpen')}
          handleAuthenticate={handleAuthenticate}
        />
      </>
    );
  }
}

Auth.propTypes = {
  isRegisterOpen: bool.isRequired,
  isLoginOpen: bool.isRequired,
  closeDialog: func.isRequired,
  isVerificationCode: bool,
  reEnterVerificationCodeAction: func.isRequired,
  closeRegisterSuccessModalAction: func.isRequired,
  iSignUpSuccessModal: bool,
  verificationErrorMessage: string,
  resendVerificationCodeStatus: string,
  closeResendStatusModal: func.isRequired,
  handleAuthenticate: func.isRequired,
  resetPasswordStatus: string.isRequired,
  resetPasswordMessage: string.isRequired,
  clearResetPasswordStatusAction: func.isRequired,
  autoLoginAction: func.isRequired,
  logoutAction: func.isRequired,
  onReloadApp: func.isRequired,
};

Auth.defaultProps = {
  isVerificationCode: false,
  iSignUpSuccessModal: false,
  verificationErrorMessage: '',
  resendVerificationCodeStatus: 'none',
};

const mapStateToProps = state => ({
  ...state.auth,
});

export default connect(
  mapStateToProps,
  {
    reEnterVerificationCodeAction: reEnterVerificationCode,
    closeRegisterSuccessModalAction: closeRegisterSuccessModal,
    closeResendStatusModal: resetResendVerificationCodeModal,
    clearResetPasswordStatusAction: clearResetPasswordStatus,
    logoutAction: logout,
    autoLoginAction: autoLogin,
  },
)(Auth);
