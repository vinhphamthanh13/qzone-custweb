import React, { Component } from 'react';
import {
  func, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal, Paper, Button, Typography, TextField, InputAdornment,
} from '@material-ui/core';
import { regExPattern } from 'utils/constants';
import { confirmSignUp, resendCode } from '../actions/register';
import ResendVerificationCode from './ResendVerificationCode';
import s from './VerificationCode.module.scss';

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
    const { resendCodeAction, userDetail: { email } } = this.props;
    resendCodeAction(email);
    this.setState({ ...this.initState }, this.startTick);
  };

  handleSubmitCode = () => {
    const { verificationCode } = this.state;
    const { confirmSignUpAction, userDetail } = this.props;
    this.stopTick();
    confirmSignUpAction({ userDetail, code: verificationCode });
  };

  render() {
    const { countDown, verificationCode, verificationCodeError } = this.state;

    return (
      <Modal
        open
        className="modal-wrapper"
        disableAutoFocus
        disableBackdropClick
        disableEscapeKeyDown
      >
        <Paper className={s.paper}>
          <div className={s.content}>
            <Typography variant="h6" color="primary">Enter verification code</Typography>
            <Typography variant="subheading" color="textSecondary">(code was sent to your registered email)</Typography>
            <TextField
              disabled={!countDown}
              fullWidth
              value={verificationCode}
              onChange={this.handleOnChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    classes={{
                      root: s.countDown,
                    }}
                  >
                    <Typography
                      variant="subheading"
                      color="primary"
                    >
                      {countDown} {countDown > 1 ? 'secs' : 'sec'}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <div className={s.footerActions}>
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
  confirmSignUpAction: func.isRequired,
  userDetail: objectOf(any).isRequired,
  resendCodeAction: func.isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(
  mapStateToProps,
  {
    confirmSignUpAction: confirmSignUp,
    resendCodeAction: resendCode,
  },
)(VerificationCode);
