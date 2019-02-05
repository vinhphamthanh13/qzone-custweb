import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withStyles from '@material-ui/core/styles/withStyles';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import ErrorModal from 'components/Modal/Error';
import { classesType } from 'types/global';
import { registerAWS, resetErrorMessage } from 'modules/auth.actions';
import { regExPattern } from 'utils/constants';
import UserForm from './forms/Register';
import authStyles from './Auth.style';

const registerSchema = Yup.object().shape({
  givenName: Yup
    .string()
    .min(3, 'Given name must have at least 3 characters')
    .required('Given name is Required'),
  telephone: Yup
    .string()
    .min(10, 'Phone number must have at least 10 numbers')
    .matches(regExPattern.phoneNumber, 'Phone number format is not correct')
    .required('Phone number is required'),
  email: Yup
    .string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .matches(regExPattern.password, 'Password format is not correct')
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Confirm password is not matched')
    .required('Confirm password is required'),
  policyAgreement: Yup
    .bool()
    .oneOf([true], 'You have to agree our policy to register a new account')
    .required(),
});

class RegisterModal extends React.Component {
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
      classes, isOpen,
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
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            {errorModal}
            <Formik
              initialValues={registerInit}
              validationSchema={registerSchema}
              enableReinitialize
              onSubmit={this.registerHandle}
              render={props => (
                <UserForm
                  {...props}
                  classes={classes}
                  onClose={this.onClose}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

RegisterModal.propTypes = {
  classes: classesType.isRequired,
  registerAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  registerPayload: PropTypes.objectOf(PropTypes.any),
  resetErrorMessageAction: PropTypes.func.isRequired,
};

RegisterModal.defaultProps = {
  errorMessage: '',
  registerPayload: {},
  isOpen: false,
};

const mapStateToProps = state => ({
  errorMessage: state.auth.registerErrorMessage,
  registerPayload: state.auth.registerPayload,
});

export default compose(
  withStyles(authStyles),
  connect(mapStateToProps, {
    registerAction: registerAWS,
    resetErrorMessageAction: resetErrorMessage,
  }),
)(RegisterModal);
