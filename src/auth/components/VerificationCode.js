import React, { Component } from 'react';
import {
  func, objectOf, any,
} from 'prop-types';
import { classesType } from 'types/global';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Modal, Paper, Button, Typography, Avatar, TextField, InputAdornment,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { regExPattern } from 'utils/constants';
import logo from 'images/logo.png';
import { confirmSignUp, resendCode } from '../actions/register';
import ResendVerificationCode from './ResendVerificationCode';
import s from './VerificationCode.style';

class VerificationCode extends Component {
  initState = {
    countDown: 60,
    verificationCode: '',
    verificationCodeError: true,
  };

  state = this.initState;

  countDownOneMinute = null;

  componentDidMount() {
    this.startTick();
  }

  componentWillUnmount() {
    this.stopTick();
  }

  tick = () => {
    const { countDown } = this.state;
    if (countDown <= 2) {
      this.stopTick();
    }
    setTimeout(() => {
      this.setState(prevState => ({
        countDown: prevState.countDown - 1,
      }));
    }, 1000);
  };

  startTick = () => {
    this.countDownOneMinute = setInterval(this.tick, 1000);
  };

  stopTick = () => {
    clearInterval(this.countDownOneMinute);
  };

  handleOnChange = (event) => {
    event.preventDefault();
    const { target: { value } } = event;
    if (!/^\S+$/.test(value) && value.length) return;
    this.setState({
      verificationCode: value,
      verificationCodeError: !regExPattern.registerVerificationCode.test(value),
    });
  };

  handleResendCode = () => {
    const { resendCodeAction, userDetails: { email } } = this.props;
    resendCodeAction(email);
    this.setState({ ...this.initState }, this.startTick);
  };

  handleSubmitCode = () => {
    const { verificationCode } = this.state;
    const { confirmSignUpAction, userDetails: { email } } = this.props;
    this.stopTick();
    confirmSignUpAction({ email, code: verificationCode });
  };

  render() {
    const { countDown, verificationCode, verificationCodeError } = this.state;
    const { classes } = this.props;

    return (
      <Modal
        open
        className="modal-wrapper"
        disableAutoFocus
        disableBackdropClick
        disableEscapeKeyDown
      >
        <Paper className="verification-modal">
          <div className="verification-modal-logo">
            <Avatar className="verification-modal-avatar" src={logo} />
          </div>
          <div className="verification-modal-content">
            <Typography variant="h6" color="primary">Enter verification code</Typography>
            <Typography variant="subheading" color="textSecondary">(code was sent to your email)</Typography>
            <TextField
              disabled={!countDown}
              fullWidth
              value={verificationCode}
              onChange={this.handleOnChange}
              InputProps={{
                className: classes.header,
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="subheading"
                      color="primary"
                      className={classes.countDown}
                    >
                      {countDown} sec
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <div className={classes.footerActions}>
              <ResendVerificationCode
                isDisabledResend={!!countDown}
                resendCodeAction={this.handleResendCode}
              />
              <Button
                disabled={verificationCodeError || !countDown}
                onClick={this.handleSubmitCode}
              >Submit
              </Button>
            </div>
          </div>
        </Paper>
      </Modal>
    );
  }
}

VerificationCode.propTypes = {
  classes: classesType.isRequired,
  confirmSignUpAction: func.isRequired,
  userDetails: objectOf(any).isRequired,
  resendCodeAction: func.isRequired,
};

const mapStateToProps = state => ({
  userDetails: state.auth.userDetails,
});

export default compose(
  withStyles(s),
  connect(mapStateToProps, {
    confirmSignUpAction: confirmSignUp,
    resendCodeAction: resendCode,
  }),
)(VerificationCode);
