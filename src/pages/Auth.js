import React, { Component } from 'react';
import {
  bool,
  func,
  string,
} from 'prop-types';
import { connect } from 'react-redux';
import { noop, get } from 'lodash';
import Register from 'authentication/Register';
import Login from 'authentication/Login';
import VerificationCode from 'authentication/components/VerificationCode';
import CustomModal from 'components/Modal/CustomModal';
import { logout, clearLogoutErrorStatus } from 'authentication/actions/logout';
import {
  reEnterVerificationCode, closeRegisterSuccessModal, resetResendVerificationCodeModal,
  clearResetPasswordStatus,
} from 'authentication/actions/register';
import { login as autoLogin } from 'authentication/actions/login';
import { SESSION } from 'utils/constants';

class Auth extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      loginSession,
      userDetail,
    } = props;
    const {
      loginSession: cachedLoginSession,
      userDetail: cachedUserDetail,
    } = state;
    if (
      loginSession !== cachedLoginSession
      || userDetail !== cachedUserDetail
    ) {
      return {
        loginSession,
        userDetail,
      };
    }
    return null;
  }

  state = {
    isSessionTimeout: false,
    loginSession: null,
    userDetail: null,
  };

  sessionTimeout = 0;

  componentWillMount() {
    const { getSessionTimeoutId } = this.props;
    const { loginSession } = this.state;
    const isAuthenticated = get(loginSession, 'isAuthenticated');
    if (isAuthenticated) {
      const startSession = get(loginSession, 'start_session');
      const currentTime = new Date().getTime();
      const sessionLive = currentTime - startSession;
      if (sessionLive > SESSION.TIMEOUT) {
        this.handleLogout();
      } else {
        const startTimeout = SESSION.TIMEOUT - parseInt(sessionLive, 0);
        this.sessionTimeout = setTimeout(this.endSession, startTimeout);
        getSessionTimeoutId(this.sessionTimeout);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      loginSession,
      getSessionTimeoutId,
    } = prevProps;
    const {
      loginSession: cachedLoginSession,
    } = this.state;
    const startSession = get(cachedLoginSession, 'start_session');
    const currentTime = new Date().getTime();
    const sessionLive = currentTime - startSession;
    if (sessionLive > SESSION.TIMEOUT) {
      this.handleLogout();
    }
    if (loginSession !== cachedLoginSession) {
      this.sessionTimeout = setTimeout(this.endSession, SESSION.TIMEOUT);
      getSessionTimeoutId(this.sessionTimeout);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.sessionTimeout);
  }

  endSession = () => {
    this.handleLogout();
    this.setState({ isSessionTimeout: true });
  };

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
    const { logoutAction } = this.props;
    clearTimeout(this.sessionTimeout);
    logoutAction();
  };

  handlePopupLogin = () => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate('isLoginOpen');
    this.setState({ isSessionTimeout: false });
  };

  handleLogoutError = () => {
    const { clearLogoutErrorStatusAction } = this.props;
    clearLogoutErrorStatusAction();
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
      isLogoutError,
      logoutErrorMessage,
    } = this.props;
    const {
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

    const renderLogoutError = isLogoutError ? (
      <CustomModal
        type="error"
        isOpen
        title="Sign out error"
        message={logoutErrorMessage}
        onClose={this.handleLogoutError}
      />) : null;

    return (
      <>
        {renderLogoutError}
        {renderSessionTimeout}
        {verificationCodeModal}
        {errorModal}
        {successModal}
        {resendModal}
        {resetPasswordModal}
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
  getSessionTimeoutId: func,
  isLogoutError: bool,
  logoutErrorMessage: string,
  clearLogoutErrorStatusAction: func.isRequired,
};

Auth.defaultProps = {
  isVerificationCode: false,
  iSignUpSuccessModal: false,
  verificationErrorMessage: '',
  resendVerificationCodeStatus: 'none',
  isLogoutError: false,
  logoutErrorMessage: '',
  getSessionTimeoutId: noop,
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
    clearLogoutErrorStatusAction: clearLogoutErrorStatus,
  },
)(Auth);
