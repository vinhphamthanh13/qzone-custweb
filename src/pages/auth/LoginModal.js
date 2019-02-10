import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Modal } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ErrorModal from 'components/Modal/Error';
import { classesType } from 'types/global';
import {
  googleSignIn, facebookSignIn, standardSignIn, resetErrorMessage,
} from 'modules/auth.actions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { regExPattern, loginType } from 'utils/constants';
import UserForm from './forms/Login';
import authStyles from './Auth.style';

const loginSchema = Yup.object().shape({
  email: Yup
    .string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .max(60, 'Password must not be over 60 characters')
    .required('Password is required'),
});

class LoginModal extends React.Component {
  state = {
    error: { open: false, errorMessage: '' },
  };

  componentWillReceiveProps(nextProps) {
    const { errorMessage } = nextProps;
    let error = {};
    if (errorMessage) {
      error = { open: true, errorMessage };
    } else {
      error = { open: false, errorMessage };
    }
    this.setState({ error });
  }

  onLogin = (values, name) => {
    const { standardSignInAction, facebookSignInAction, googleSignInAction } = this.props;
    switch (name) {
      case loginType.FB:
        facebookSignInAction();
        break;
      case loginType.GP:
        googleSignInAction();
        break;
      default:
        standardSignInAction(values);
    }
    this.onClose();
  };

  onClose = () => {
    this.props.onClose();
  };

  closeErrorModal = () => {
    const { resetErrorMessageAction } = this.props;
    resetErrorMessageAction();
  };

  render() {
    const {
      classes, isOpen,
    } = this.props;
    const socialActions = {
      facebook: () => this.onLogin('', loginType.FB),
      google: () => this.onLogin('', loginType.GP),
    };
    const loginInit = {
      email: '',
      password: '',
    };
    const { error: { open, errorMessage } } = this.state;
    const errorModal = open
      ? (
        <ErrorModal
          errorTitle="Login failed!"
          errorMessage={errorMessage}
          isOpen={!!errorMessage}
          onClose={this.closeErrorModal}
        />) : null;

    return (
      <Modal open={isOpen} className={classes.content}>
        <>
          {errorModal}
          <Formik
            initialValues={loginInit}
            validationSchema={loginSchema}
            enableReinitialize
            onSubmit={this.onLogin}
            render={props => (
              <UserForm
                {...props}
                classes={classes}
                onClose={this.onClose}
                socialActions={socialActions}
              />
            )}
          />
        </>
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  classes: classesType.isRequired,
  googleSignInAction: PropTypes.func.isRequired,
  standardSignInAction: PropTypes.func.isRequired,
  facebookSignInAction: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  resetErrorMessageAction: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

LoginModal.defaultProps = {
  errorMessage: '',
  isOpen: false,
};

const mapStateToProps = state => ({
  errorMessage: state.auth.loginErrorMessage,
});

export default compose(
  withStyles(authStyles),
  connect(mapStateToProps, {
    googleSignInAction: googleSignIn,
    facebookSignInAction: facebookSignIn,
    standardSignInAction: standardSignIn,
    resetErrorMessageAction: resetErrorMessage,
  }),
)(LoginModal);
