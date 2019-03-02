import React, { Component } from 'react';
import { func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import {
  Typography, Modal, Paper, Avatar, Tooltip,
} from '@material-ui/core';
import logo from 'images/logo.png';
import { regExPattern, noop } from 'utils/constants';
import { forgotPassword, forgotPasswordSubmit, toggleResetPassword } from 'authentication/actions/register';
import FormPassword from './FormPassword';
import { forgotPasswordSchema } from './schemas';

class ForgotPassword extends Component {
  onChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    if (!/^\S+$/.test(value) && value.length) return;
    this.setState({ [name]: value });
  };

  handleReqVerificationCode = () => {
    const { forgotPasswordAction, email } = this.props;
    forgotPasswordAction(email);
  };

  handleSubmitNewPassword = (value) => {
    const { email, forgotPasswordSubmitAction } = this.props;
    const { code, password } = value;
    forgotPasswordSubmitAction({ email, code, new_password: password });
  };

  handleCloseResetPassword = () => {
    const { closeResetPasswordAction } = this.props;
    closeResetPasswordAction(false);
  };

  render() {
    const {
      isForgotPassword, email,
    } = this.props;
    const forgotInit = {
      code: '',
      password: '',
      confirmPassword: '',
    };
    const [forgotPasswordTitle, forgotClass] = !regExPattern.email.test(email)
      ? ['Enter your email above to reset password!', 'button-pad-bot text-right hover-pointer']
      : ['', 'button-pad-bot hover-pointer text-right hover-main-color'];
    const cta = !regExPattern.email.test(email) ? noop : this.handleReqVerificationCode;
    return (
      <>
        <div className="flex h-end">
          <div>
            <Tooltip title={forgotPasswordTitle} placement="top-end" classes={{ tooltip: 'tooltip-lg' }}>
              <Typography
                onClick={cta}
                variant="subtitle2"
                color="textSecondary"
                className={forgotClass}
              >
                Forgot Password?
              </Typography>
            </Tooltip>
          </div>
        </div>
        <Modal
          open={isForgotPassword}
          className="modal-wrapper"
          disableAutoFocus
          disableBackdropClick
          disableEscapeKeyDown
        >
          <Paper className="verification-modal">
            <div className="verification-modal-logo">
              <Avatar className="verification-modal-avatar" src={logo} />
            </div>
            <div className="verification-modal-content">
              <Typography variant="h6" color="primary">Resetting Password</Typography>
              <Typography variant="caption" color="textSecondary">(Code was sent to your email {email})</Typography>
              <Formik
                initialValues={forgotInit}
                validationSchema={forgotPasswordSchema}
                enableReinitialize
                onSubmit={this.handleSubmitNewPassword}
                render={props => (
                  <FormPassword
                    {...props}
                    handleCloseModal={this.handleCloseResetPassword}
                  />
                )}
              />
            </div>
          </Paper>
        </Modal>
      </>
    );
  }
}

ForgotPassword.propTypes = {
  forgotPasswordAction: func.isRequired,
  forgotPasswordSubmitAction: func.isRequired,
  isForgotPassword: bool.isRequired,
  email: string.isRequired,
  closeResetPasswordAction: func.isRequired,
};

const mapStateToProps = state => ({
  isForgotPassword: state.auth.isForgotPassword,
});

export default connect(mapStateToProps, {
  forgotPasswordAction: forgotPassword,
  forgotPasswordSubmitAction: forgotPasswordSubmit,
  closeResetPasswordAction: toggleResetPassword,
})(ForgotPassword);
