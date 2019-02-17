import React from 'react';
import {
  bool, func, string, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { Modal } from '@material-ui/core';
import ErrorModal from 'components/Modal/Error';
import { registerAWS, resetErrorMessage } from 'modules/auth.actions';
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

  registerHandle = (values) => {
    const { registerAction } = this.props;
    registerAction(values);
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
      isOpen,
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
        <ErrorModal
          errorTitle="Register failed!"
          errorMessage={errorMessage}
          isOpen={!!errorMessage}
          onClose={this.closeErrorModal}
        />) : null;
    return (
      <>
        {errorModal}
        <Modal open={isOpen} className="flex item-center">
          <Formik
            initialValues={registerInit}
            validationSchema={registerSchema}
            enableReinitialize
            onSubmit={this.registerHandle}
            render={props => (
              <Form
                {...props}
                onClose={this.onClose}
                formType="register"
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
  registerAction: registerAWS,
  resetErrorMessageAction: resetErrorMessage,
})(Register);
