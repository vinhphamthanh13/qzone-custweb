import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Checkbox, FormControlLabel,
} from '@material-ui/core';
// import { Formik, Form, Field } from 'formik';
// import * as yup from 'yup';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  Email, Lock as LockOutline, Check, InsertEmoticon, Call,
} from '@material-ui/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import GridContainer from 'components/Grid/GridContainer';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import CustomInput from 'components/CustomInput';
import { validatePassword } from 'utils/validation';
import { classesType } from 'types/global';
import { register } from 'modules/auth.actions';
import { regExPattern } from 'utils/constants';
import registerStyle from './Register.style';

// const registerUser = yup.object().shape({
//   givenName: yup.string().required(),
//   familyName: yup.string().required(),
//   telephone: yup.string().required(),
//   email: yup.string().email('Email is not valid').required('Email is required'),
//   password: yup
//     .string()
//     .min(8)
//     .required('Password is required'),
//   confirmPassword: yup
//     .string()
//     .min(8)
//     .required('Confirm password is required'),
//   address: yup.object().shape({
//     streetAddress: yup.string(),
//     state: yup.string(),
//     district: yup.string(),
//     city: yup.string(),
//     postCode: yup.string(),
//     country: yup.string(),
//   }),
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
    // const {
    //   // userName, email, pwd, confirmPwd,
    // } = this.state;
    const adornmentClass = classes.inputAdornmentIconDefault;
    const validateSubmittedData = false;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4} className={classes.register}>
            <form>
              <Card className={classes.registerCard}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="main"
                >
                  <Typography variant="h5" color="inherit">Register</Typography>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText="Given name"
                    success={this.state.emailState === 'success'}
                    error={this.state.emailState === 'error'}
                    id="givename"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.marginDense,
                    }}
                    inputProps={{
                      autoFocus: true,
                      type: 'text',
                      endAdornment: (
                        <InputAdornment position="end">
                          <InsertEmoticon className={adornmentClass} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={event => this.change(event, 'giveName', 'name')}
                  />
                  <CustomInput
                    labelText="Phone number"
                    success={this.state.emailState === 'success'}
                    error={this.state.emailState === 'error'}
                    id="phonenumber"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.marginDense,
                    }}
                    inputProps={{
                      type: 'text',
                      endAdornment: (
                        <InputAdornment position="end">
                          <Call className={adornmentClass} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={event => this.change(event, 'giveName', 'name')}
                  />
                  <CustomInput
                    labelText="Email"
                    success={this.state.emailState === 'success'}
                    error={this.state.emailState === 'error'}
                    id="email"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.marginDense,
                    }}
                    inputProps={{

                      type: 'email',
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={adornmentClass} />
                        </InputAdornment>
                      ),
                    }}
                    onChange={event => this.change(event, 'email', 'email')}
                  />
                  <CustomInput
                    labelText="Password"
                    success={this.state.pwd === 'success'}
                    error={this.state.pwd === 'error'}
                    id="registerPassword"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.marginDense,
                    }}
                    inputProps={{

                      type: 'password',
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockOutline
                            className={adornmentClass}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onChange={event => this.change(
                      event, 'registerPassword', 'password', 'registerConfirmPassword',
                    )}
                  />
                  <CustomInput
                    labelText="Confirm password"
                    success={this.state.confirmPwd === 'success'}
                    error={this.state.confirmPwd === 'error'}
                    id="registerConfirmPassword"
                    formControlProps={{
                      fullWidth: true,
                      className: classes.marginDense,
                    }}
                    inputProps={{

                      type: 'password',
                      endAdornment: (
                        <InputAdornment position="end">
                          <LockOutline
                            className={adornmentClass}
                          />
                        </InputAdornment>
                      ),
                    }}
                    onChange={event => this.change(event, 'registerConfirmPassword', 'equalTo', 'registerPassword')}
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        tabIndex={-1}
                        onClick={event => this.change(
                          event, 'registerCheckbox', 'checkbox',
                        )}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.agreement,
                        }}
                      />
                    )}
                    classes={{
                      label:
                        classes.label
                        + (this.state.registerCheckboxState === 'error'
                          ? ` ${classes.labelError}`
                          : ''),
                    }}
                    label={(
                      <span>
                        I agree to the terms and conditions
                      </span>
                    )}
                  />
                  <div className={classes.center}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => this.registerClick()}
                      disabled={!validateSubmittedData}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="text"
                      // fullWidth
                      disableRipple
                      block
                      className={classes.simpleButton}
                      onClick={this.onClose}
                    >
                      Discard
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </form>
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
