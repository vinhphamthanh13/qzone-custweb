import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Checkbox, FormControlLabel, Typography,
} from '@material-ui/core';
import { Check } from '@material-ui/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';

import GridContainer from 'components/Grid/GridContainer';
import CustomButton from 'components/CustomButton';
import CustomInput from 'components/CustomInput';
import GridItem from 'components/Grid/GridItem';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { validatePassword } from 'utils/validation';
import { classesType } from 'types/global';
import { register } from 'modules/auth.actions';
import registerStyle from './Register.style';
// import VerificationPage from './VerificationPage';

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
  verifyEmail = value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(value)

  verifyLength = (value, length) => value.length >= length

  compare = (string1, string2) => string1 === string2

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
  }

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
  }

  onClose = () => {
    this.setState(this.defaultState);
    this.props.onClose();
  }

  render() {
    const { classes, isOpen } = this.props;
    const {
      userName, email, pwd, confirmPwd,
    } = this.state;
    return (
      <div style={isOpen ? {} : { display: 'none' }} className={classes.content}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form>
                <Card>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                  >
                    <Typography variant="h5" color="inherit">Register</Typography>
                  </CardHeader>

                  <CardBody>
                    <CustomInput
                      labelText="User name"
                      success={this.state.userNameState === 'success'}
                      error={this.state.userNameState === 'error'}
                      id="userName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => this.change(event, 'userName'),
                        value: userName,
                      }}
                    />

                    <CustomInput
                      labelText="Email"
                      success={this.state.emailState === 'success'}
                      error={this.state.emailState === 'error'}
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => this.change(event, 'email', 'email'),
                        type: 'email',
                        value: email,
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      success={this.state.pwdState === 'success'}
                      error={this.state.pwdState === 'error'}
                      id="pwd"
                      formControlProps={{
                        fullWidth: true,
                      }}

                      inputProps={{
                        onChange: event => this.change(
                          event, 'pwd', 'pwd', 'confirmPwd',
                        ),
                        type: 'password',
                        value: pwd,
                      }}
                    />
                    <CustomInput
                      labelText="Confirm Password"
                      success={this.state.confirmPwdState === 'success'}
                      error={this.state.confirmPwdState === 'error'}
                      id="confirmPwd"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => this.change(
                          event, 'confirmPwd', 'equalTo', 'pwd',
                        ),
                        type: 'password',
                        value: confirmPwd,
                      }}
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={event => this.change(event, 'registerCheckbox', 'checkbox')
                          }
                          checkedIcon={<Check className={classes.checkedIcon} />}
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
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
                    {/* <VerificationPage
                      open={this.props.verify}
                      email={this.state.email}
                      history={history}
                      page="register"
                    /> */}
                    <div className={classes.center}>
                      <CustomButton
                        color="rose"
                        onClick={this.registerClick}
                      >
                        Register
                      </CustomButton>
                      <CustomButton
                        color="transparent"
                        onClick={this.onClose}
                      >
                        Close
                      </CustomButton>
                    </div>
                  </CardBody>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
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
