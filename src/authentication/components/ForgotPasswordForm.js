import React from 'react';
import { connect } from 'react-redux';
import {
  Modal, Paper, Typography,
} from '@material-ui/core';
import { Formik } from 'formik';
import { forgotPasswordSchema } from 'authentication/components/schemas';
import FormPassword from 'authentication/components/FormPassword';
import { forgotPasswordSubmit, toggleResetPassword } from 'authentication/actions/register';
import s from './ForgotPasswordForm.module.scss';

class ForgotPasswordForm extends React.Component {
  state = {
    isForgotPassword: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { isForgotPassword } = props;
    const { isForgotPassword: cisForgotPassword } = state;
    if (isForgotPassword !== cisForgotPassword) {
      return {
        isForgotPassword,
      };
    }

    return null;
  }

  handleCloseResetPassword = () => {
    const { closeResetPasswordAction } = this.props;
    closeResetPasswordAction(false);
  };

  handleSubmitNewPassword = (value) => {
    const { forgotPasswordSubmitAction } = this.props;
    const { isForgotPassword: { email } } = this.state;
    const { code, password } = value;
    forgotPasswordSubmitAction({ email, code, new_password: password });
  };

  render() {
    const { isForgotPassword: { email } } = this.state;
    const forgotInit = {
      code: '',
      password: '',
      confirmPassword: '',
    };

    return (
      <Modal
        open
        className="modal-wrapper"
        disableAutoFocus
        disableBackdropClick
        disableEscapeKeyDown
      >
        <Paper className={s.rstPaper}>
          <div className={s.rstContent}>
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
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isForgotPassword: auth.isForgotPassword,
});

export default connect(mapStateToProps, {
  forgotPasswordSubmitAction: forgotPasswordSubmit,
  closeResetPasswordAction: toggleResetPassword,
})(ForgotPasswordForm);
