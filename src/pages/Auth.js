import React, { Component } from 'react';
import {
  bool, func, string, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import Register from 'auth/Register';
import Login from 'auth/Login';
import VerificationCode from 'auth/components/VerificationCode';
import CustomModal from 'components/Modal/CustomModal';
import { reEnterVerificationCode } from 'auth/actions/register';

class Auth extends Component {
  handleReEnterVerificationCode = () => {
    const { reEnterVerificationCodeAction } = this.props;
    reEnterVerificationCodeAction();
  };

  render() {
    const {
      isRegisterOpen, isLoginOpen, closeDialog, isVerificationCode,
      verificationErrorMessage, iSignUpSuccessModal, userDetails: { email },
    } = this.props;
    const verificationCodeModal = isVerificationCode ? <VerificationCode /> : null;
    const errorModal = verificationErrorMessage ? (
      <CustomModal
        type="error"
        isOpen
        title="Verification Error"
        message="Verification code is not valid! Please try again"
        onClose={this.handleReEnterVerificationCode}
      />
    ) : null;
    const successModal = iSignUpSuccessModal ? (
      <CustomModal
        type="info"
        isOpen
        title="Register Success"
        message={`New user is created ${email}`}
      />
    ) : null;

    return (
      <>
        {verificationCodeModal}
        {errorModal}
        {successModal}
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
  iSignUpSuccessModal: bool,
  verificationErrorMessage: string,
  userDetails: objectOf(any).isRequired,
};

Auth.defaultProps = {
  isVerificationCode: false,
  iSignUpSuccessModal: false,
  verificationErrorMessage: '',
};

const mapStateToProps = state => ({
  isVerificationCode: state.auth.isVerificationCode,
  iSignUpSuccessModal: state.auth.iSignUpSuccessModal,
  userDetails: state.auth.userDetails,
  verificationErrorMessage: state.auth.verificationErrorMessage,
});

export default connect(
  mapStateToProps,
  { reEnterVerificationCodeAction: reEnterVerificationCode },
)(Auth);
