import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';

import { validatePassword } from 'utils/validation';
import { classesType } from 'types/global';
import { register } from 'modules/auth.actions';
import { regExPattern } from 'utils/constants';
import UserForm from './forms/Register';
import registerStyle from './Auth.style';
//
// const registerUser = Yup.object().shape({
//   givenName: Yup.string().required(),
//   phoneNumber: Yup.string().required(),
//   email: Yup.string().email('Email is not valid').required('Email is required'),
//   password: Yup
//     .string()
//     .min(8)
//     .required('Password is required'),
//   confirmPassword: Yup
//     .string()
//     .min(8)
//     .required('Confirm password is required'),
// });

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      userName: '',
      userNameState: '',
      email: '',
      emailState: '',
      pwd: '',
      pwdState: '',
      confirmPwd: '',
      confirmPwdState: '',
      registerCheckbox: false,
      registerCheckboxState: '',
      openVerificationModal: false,
      code: '',
    };
    this.state = { ...this.defaultState };
  }

  // eslint-disable-next-line max-len
  verifyEmail = value => regExPattern.email.test(value);

  verifyLength = (value, length) => value.length >= length;

  compare = (string1, string2) => string1 === string2;

  registerClick = () => {
    if (this.state.emailState === '') {
      this.setState({ emailState: 'error' });
    }
    if (this.state.pwdState === '') {
      this.setState({ pwdState: 'error' });
    }
    if (this.state.userName === '') {
      this.setState({ userNameState: 'error' });
    }
    if (this.state.confirmPwdState === ''
      || this.state.pwd !== this.state.confirmPwd) {
      this.setState({ confirmPwdState: 'error' });
    }
    if (this.state.registerCheckboxState === '') {
      this.setState({ registerCheckboxState: 'error' });
    }
    if (this.state.emailState === 'success' && this.state.pwdState === 'success'
      && this.state.confirmPwdState === 'success' && this.state.registerCheckboxState === 'success') {
      this.props.registerAction(this.state);
    }
  };

  change = (event, stateName, type, stateNameEqualTo) => {
    switch (type) {
      case 'email':
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [`${stateName}State`]: 'success' });
        } else {
          this.setState({ [`${stateName}State`]: 'error' });
        }
        this.setState({ [stateName]: event.target.value });
        break;
      case 'password':
        if (this.verifyLength(event.target.value, 3) && validatePassword(event.target.value)) {
          this.setState({ [`${stateName}State`]: 'success' });
          if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
            this.setState({ [`${stateNameEqualTo}State`]: 'success' });
          } else {
            this.setState({ [`${stateNameEqualTo}State`]: 'error' });
          }
        } else {
          this.setState({ [`${stateName}State`]: 'error' });
        }
        this.setState({ [stateName]: event.target.value });
        break;
      case 'equalTo':
        if (this.compare(event.target.value, this.state[stateNameEqualTo])) {
          this.setState({ [`${stateName}State`]: 'success' });
        } else {
          this.setState({ [`${stateName}State`]: 'error' });
        }
        this.setState({ [stateName]: event.target.value });
        break;
      case 'checkbox':
        if (event.target.checked) {
          this.setState({ [`${stateName}State`]: 'success' });
        } else {
          this.setState({ [`${stateName}State`]: 'error' });
        }
        this.setState({ [stateName]: event.target.value });
        break;
      default:
        if (event.target.value) {
          this.setState({ [`${stateName}State`]: 'success' });
        } else {
          this.setState({ [`${stateName}State`]: 'error' });
        }
        this.setState({ [stateName]: event.target.value });
        break;
    }
  };

  onClose = () => {
    this.setState(this.defaultState);
    this.props.onClose();
  };

  render() {
    const { classes, isOpen } = this.props;
    // const registerInit = {
    //   givenName: '',
    //   phoneNumber: '',
    //   email: '',
    //   password: '',
    //   confirmPassword: '',
    // };
    const {
    //   // userName, email, pwd, confirmPwd,
      registerCheckboxState,
    } = this.state;
    const adornmentClass = classes.inputAdornmentIconDefault;
    const isFormValid = false;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            <UserForm
              classes={classes}
              iconClassName={adornmentClass}
              onSubmitHandler={this.registerClick}
              onChange={this.change}
              isFormValid={isFormValid}
              onClose={this.onClose}
              policyAgreement={registerCheckboxState}
            />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  classes: classesType.isRequired,
  registerAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// const mapStateToProps = state => ({
// });

export default compose(
  withStyles(registerStyle),
  connect(null, { registerAction: register }),
)(RegisterPage);
