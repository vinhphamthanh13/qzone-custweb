import React, { Component } from 'react';
import { func, bool, string } from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import {
  Typography, Modal, Paper, Avatar,
} from '@material-ui/core';
import logo from 'images/logo.png';
import { forgotPassword, forgotPasswordSubmit } from 'auth/actions/register';
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

  render() {
    const {
      isForgotPassword,
    } = this.props;
    console.log('isForgotPassword', isForgotPassword);
    const forgotInit = {
      code: '',
      password: '',
      confirmPassword: '',
    };
    return (
      <>
        <Typography
          onClick={this.handleReqVerificationCode}
          variant="subtitle2"
          color="primary"
        >
          Forgot Password?
        </Typography>
        <Modal
          // open={isForgotPassword}
          open
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
              <Typography variant="body2" color="textSecondary">(Code was sent to your email)</Typography>
              <Formik
                initialValues={forgotInit}
                validationSchema={forgotPasswordSchema}
                enableReinitialize
                onSubmit={this.handleSubmitNewPassword}
                render={props => (
                  <FormPassword {...props} />
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
};

const mapStateToProps = state => ({
  isForgotPassword: state.auth.isForgotPassword,
});

export default connect(mapStateToProps, {
  forgotPasswordAction: forgotPassword,
  forgotPasswordSubmitAction: forgotPasswordSubmit,
})(ForgotPassword);
