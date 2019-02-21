import React, { Component } from 'react';
import {
  bool, func, string, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import Register from 'auth/Register';
import Login from 'auth/Login';
import VerificationCode from 'auth/components/VerificationCode';
import CustomModal from 'components/Modal/CustomModal';
import {
  reEnterVerificationCode, closeRegisterSuccessModal, resetResendVerificationCodeModal,
} from 'auth/actions/register';

class Auth extends Component {
  handleReEnterVerificationCode = () => {
    const { reEnterVerificationCodeAction } = this.props;
    reEnterVerificationCodeAction();
  };

  handleCloseRegisterSuccessModal = () => {
    const { closeRegisterSuccessModalAction } = this.props;
    closeRegisterSuccessModalAction();
  };

  handleCloseResendStatusModal = () => {
    const { closeResendStatusModal } = this.props;
    closeResendStatusModal();
  };

  render() {
    const {
      isRegisterOpen, isLoginOpen, closeDialog, isVerificationCode,
      verificationErrorMessage, iSignUpSuccessModal, userDetails: { email },
      resendVerificationCodeStatus,
    } = this.props;
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
        title="Register Success"
        message={`New user is created ${email}`}
        okButton
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

    return (
      <>
        {verificationCodeModal}
        {errorModal}
        {successModal}
        {resendModal}
        <Register
          isOpen={isRegisterOpen}
          onClose={() => closeDialog('isRegisterOpen')}
        />
        <Login
          isOpen={isLoginOpen}
          onClose={() => closeDialog('isLoginOpen')}
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
  verificationErrorMessage: state.auth.verificationErrorMessage,
  resendVerificationCodeStatus: state.auth.resendVerificationCodeStatus,
});

export default connect(
  mapStateToProps,
  {
    reEnterVerificationCodeAction: reEnterVerificationCode,
    closeRegisterSuccessModalAction: closeRegisterSuccessModal,
    closeResendStatusModal: resetResendVerificationCodeModal,
  },
)(Auth);
