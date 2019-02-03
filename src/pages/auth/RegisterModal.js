import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { classesType } from 'types/global';
import { register, resetErrorMessage } from 'modules/auth.actions';
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
    error: {},
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
        <Modal
          open
          onClose={this.closeErrorModal}
          className={classes.root}
        >
          <Paper className={classes.errorModal}>
            <Typography variant="h5" component="h3">
              Register failed
            </Typography>
            <div>{errorMessage}</div>
          </Paper>
        </Modal>) : null;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            {errorModal}
            <Formik
              initialValues={registerInit}
              validationSchema={registerSchema}
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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  resetErrorMessageAction: PropTypes.func.isRequired,
};

RegisterModal.defaultProps = {
  errorMessage: '',
};

const mapStateToProps = state => ({
  errorMessage: state.auth.errorMessage,
});

export default compose(
  withStyles(authStyles),
  connect(mapStateToProps, {
    registerAction: register,
    resetErrorMessageAction: resetErrorMessage,
  }),
)(RegisterModal);
