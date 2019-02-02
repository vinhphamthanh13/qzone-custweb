import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import { classesType } from 'types/global';
import { register } from 'modules/auth.actions';
import { regExPattern } from 'utils/constants';
import UserForm from './forms/Register';
import authStyles from './Auth.style';

const registerSchema = Yup.object().shape({
  givenName: Yup.string()
    .min(3, 'Given name must have at least 3 characters')
    .required('Given name is Required'),
  phoneNumber: Yup.string()
    .min(10, 'Phone number must have at least 10 numbers')
    .max(11, 'Phone number must have maximum 11 numbers')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Email is not valid')
    .matches(regExPattern.email, 'Email format is not correct')
    .required('Email is required'),
  password: Yup
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password')], 'Confirm password is not matched')
    .required('Confirm password is required'),
});

class RegisterModal extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      registerCheckbox: false,
      registerCheckboxState: '',
      // openVerificationModal: false,
      // code: '',
    };
    this.state = { ...this.defaultState };
  }

  // eslint-disable-next-line max-len
  verifyEmail = value => regExPattern.email.test(value);

  compare = (string1, string2) => string1 === string2;

  registerClick = () => {
    this.props.registerAction(this.state);
  };

  onClose = () => {
    this.setState(this.defaultState);
    this.props.onClose();
  };

  render() {
    const { classes, isOpen } = this.props;
    const registerInit = {
      givenName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    const {
      registerCheckboxState,
    } = this.state;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            <Formik
              validationSchema={registerSchema}
              initialValues={registerInit}
              render={props => (
                <UserForm
                  {...props}
                  classes={classes}
                  onSubmitHandler={this.registerClick}
                  onClose={this.onClose}
                  policyAgreement={registerCheckboxState}
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
};

// const mapStateToProps = state => ({
// });

export default compose(
  withStyles(authStyles),
  connect(null, { registerAction: register }),
)(RegisterModal);
