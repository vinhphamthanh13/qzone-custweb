import React, { Component } from 'react';
import { bool } from 'prop-types';
import { classesType } from 'types/global';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import PropTypes from 'prop-types';
// import { compose } from 'redux';
import {
  Modal, Paper, Button, Typography, Avatar, TextField, InputAdornment,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { regExPattern } from 'utils/constants';
import logo from 'images/logo.png';
// import { verifyUser } from '../actions/register';
import s from './VerificationCode.style';

class VerificationCode extends Component {
  initState = {
    countDown: 10,
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
    this.setState({
      verificationCode: value,
      verificationCodeError: !regExPattern.registerVerificationCode.test(value),
    });
  };

  resendCode = () => {
    this.startTick();
    this.setState({ ...this.initState });
  };
  //
  // handleCloseModal = () => {
  //   const { }
  // }

  render() {
    const { countDown, verificationCode, verificationCodeError } = this.state;
    const { classes, isVerificationCode } = this.props;
    console.log('error', isVerificationCode);
    return (
      <Modal
        open={true || isVerificationCode}
        onClose={this.onCloseModal}
        className="modal-wrapper"
        disableAutoFocus
        disableBackdropClick
        disableEscapeKeyDown
      >
        <Paper className={classes.verification}>
          <div className={classes.logo}>
            <Avatar className={classes.avatarRoot} src={logo} />
          </div>
          <div className={classes.content}>
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
                      {countDown}(sec)
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <div className={classes.footerActions}>
              <Button disabled={countDown} onClick={this.resendCode}>Resend code</Button>
              <Button disabled={verificationCodeError || !countDown}>Submit</Button>
            </div>
          </div>
        </Paper>
      </Modal>
    );
  }
}

VerificationCode.propTypes = {
  isVerificationCode: bool,
  classes: classesType.isRequired,
};

VerificationCode.defaultProps = {
  isVerificationCode: false,
};

const mapStateToProps = state => ({
  isVerificationCode: state.auth.isVerificationCode,
});

export default compose(
  withStyles(s),
  connect(mapStateToProps, null),
)(VerificationCode);
