import React, { Component } from 'react';
import {
  bool, func, string, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import Register from 'authentication/Register';
import Login from 'authentication/Login';
import VerificationCode from 'authentication/components/VerificationCode';
import CustomModal from 'components/Modal/CustomModal';
import { logout } from 'authentication/actions/logout';
import {
  reEnterVerificationCode, closeRegisterSuccessModal, resetResendVerificationCodeModal,
  clearResetPasswordStatus,
} from 'authentication/actions/register';
import { login as autoLogin } from 'authentication/actions/login';
import { SESSION } from 'utils/constants';

class Auth extends Component {
  state = {
    isSessionTimeout: false,
  };

  sessionTimeout = 0;

  componentDidMount() {
    const { loginSession } = this.props;
    if (loginSession && loginSession.isAuthenticated) {
      const startSession = loginSession.start_session;
      const currentTime = new Date().getTime();
      const sessionLive = currentTime - startSession;
      if (sessionLive > SESSION.TIMEOUT) {
        this.handleLogout();
      } else {
        const startTimeout = SESSION.TIMEOUT - parseInt(sessionLive, 0);
        this.sessionTimeout = setTimeout(this.endSession, startTimeout);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loginSession: prevLoginSession } = this.props;
    const { loginSession: { isAuthenticated } } = nextProps;
    const { isAuthenticated: prevAuthenticated } = prevLoginSession;
    if (isAuthenticated && isAuthenticated !== prevAuthenticated) {
      this.sessionTimeout = setTimeout(this.endSession, SESSION.TIMEOUT);
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
    const { closeRegisterSuccessModalAction, autoLoginAction, userDetails: { email, password } } = this.props;
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

  render() {
    const {
      isRegisterOpen, isLoginOpen, closeDialog, isVerificationCode,
      verificationErrorMessage, iSignUpSuccessModal, userDetails: { email },
      resendVerificationCodeStatus, handleAuthenticate, resetPasswordStatus,
      resetPasswordMessage,
    } = this.props;
    const { isSessionTimeout } = this.state;
    console.log('this.state', this.state);
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
        message={`Enjoy your new experience with Quezone! ${email}`}
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
  userDetails: objectOf(any).isRequired,
  resendVerificationCodeStatus: string,
  closeResendStatusModal: func.isRequired,
  handleAuthenticate: func.isRequired,
  resetPasswordStatus: string.isRequired,
  resetPasswordMessage: string.isRequired,
  clearResetPasswordStatusAction: func.isRequired,
  autoLoginAction: func.isRequired,
  logoutAction: func.isRequired,
  loginSession: objectOf(any).isRequired,
};

Auth.defaultProps = {
  isVerificationCode: false,
  iSignUpSuccessModal: false,
  verificationErrorMessage: '',
  resendVerificationCodeStatus: 'none',
};

const mapStateToProps = state => ({
  isVerificationCode: state.auth.isVerificationCode,
  iSignUpSuccessModal: state.auth.iSignUpSuccessModal,
  userDetails: state.auth.userDetails,
  loginSession: state.auth.loginSession,
  verificationErrorMessage: state.auth.verificationErrorMessage,
  resendVerificationCodeStatus: state.auth.resendVerificationCodeStatus,
  resetPasswordStatus: state.auth.resetPasswordStatus,
  resetPasswordMessage: state.auth.resetPasswordMessage,
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
