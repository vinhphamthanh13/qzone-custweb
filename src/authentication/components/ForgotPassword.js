import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { Typography, Tooltip } from '@material-ui/core';
import { regExPattern } from 'utils/constants';
import { forgotPassword } from 'authentication/actions/register';

class ForgotPassword extends Component {
  onChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    if (!/^\S+$/.test(value) && value.length) return;
    this.setState({ [name]: value });
  };

  handleReqVerificationCode = () => {
    const { forgotPasswordAction, email, closeAuth } = this.props;
    forgotPasswordAction(email);
    closeAuth();
  };

  render() {
    const { email } = this.props;

    const [forgotPasswordTitle, forgotClass] = !regExPattern.email.test(email)
      ? ['Enter your email above to reset password!', 'button-pad-bot text-right hover-pointer']
      : ['', 'button-pad-bot hover-pointer text-right hover-main-color'];
    const cta = !regExPattern.email.test(email) ? noop : this.handleReqVerificationCode;
    return (
      <>
        <div className="flex h-end z-index-highest">
          <div>
            <Tooltip title={forgotPasswordTitle} placement="top-end" classes={{ tooltip: 'tooltip-lg' }}>
              <Typography
                onClick={cta}
                variant="subtitle2"
                color="textSecondary"
                className={forgotClass}
              >
                Forgot Password?
              </Typography>
            </Tooltip>
          </div>
        </div>
      </>
    );
  }
}

ForgotPassword.propTypes = {
  forgotPasswordAction: func.isRequired,
  email: string.isRequired,
  closeAuth: func.isRequired,
};

export default connect(null, {
  forgotPasswordAction: forgotPassword,
})(ForgotPassword);
