import React from 'react';
import {
  bool, func, string, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Modal } from '@material-ui/core';
import CustomModal from 'components/Modal/CustomModal';
import { resetErrorMessage } from 'actionsReducers/common.actions';
import { register } from './actions/register';
import Form from './components/Form';
import { registerSchema } from './components/schemas';

class Register extends React.Component {
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

  handleRegister = (user) => {
    const { registerAction } = this.props;
    registerAction(user);
    this.onClose();
  };

  onClose = () => {
    this.props.onClose();
  };

  closeCustomModal = () => {
    const { resetErrorMessageAction } = this.props;
    resetErrorMessageAction();
  };

  render() {
    const {
      isOpen, handleAuthenticate,
    } = this.props;
    const registerInit = {
      givenName: '',
      telephone: '',
      email: '',
      password: '',
      confirmPassword: '',
      policyAgreement: false,
      address: {
        city: '',
        country: '',
        district: '',
        postCode: '',
        state: '',
        streetAddress: '',
      },
      cognitoToken: '',
      familyName: '',
      userStatus: 'UNKNOWN',
      userSub: '',
    };
    const { error: { open, errorMessage } } = this.state;
    const errorModal = open
      ? (
        <CustomModal
          type="error"
          title="Register failed!"
          message={errorMessage}
          isOpen
          onClose={this.closeCustomModal}
        />) : null;
    return (
      <>
        {errorModal}
        <Modal open={isOpen} className="flex item-center">
          <Formik
            initialValues={registerInit}
            validationSchema={registerSchema}
            enableReinitialize
            onSubmit={this.handleRegister}
            render={props => (
              <Form
                {...props}
                onClose={this.onClose}
                formType="register"
                handleAuthenticate={handleAuthenticate}
              />
            )}
          />
        </Modal>
      </>
    );
  }
}

Register.propTypes = {
  registerAction: func.isRequired,
  isOpen: bool,
  onClose: func.isRequired,
  errorMessage: string,
  registerPayload: objectOf(any),
  resetErrorMessageAction: func.isRequired,
  handleAuthenticate: func.isRequired,
};

Register.defaultProps = {
  errorMessage: '',
  registerPayload: {},
  isOpen: false,
};

const mapStateToProps = state => ({
  errorMessage: state.auth.registerErrorMessage,
  registerPayload: state.auth.registerPayload,
});

export default connect(mapStateToProps, {
  registerAction: register,
  resetErrorMessageAction: resetErrorMessage,
})(Register);
