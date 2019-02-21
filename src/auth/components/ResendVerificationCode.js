import React, { Component } from 'react';
import { func, bool } from 'prop-types';
import { Button } from '@material-ui/core';

class ResendVerificationCode extends Component {
  handleResendCode = () => {
    const { resendCodeAction } = this.props;
    resendCodeAction();
  };

  render() {
    const { isDisabledResend } = this.props;
    return (
      <Button
        onClick={this.handleResendCode}
        disabled={isDisabledResend}
      >Resend code
      </Button>
    );
  }
}

ResendVerificationCode.propTypes = {
  resendCodeAction: func.isRequired,
  isDisabledResend: bool.isRequired,
};

export default ResendVerificationCode;
