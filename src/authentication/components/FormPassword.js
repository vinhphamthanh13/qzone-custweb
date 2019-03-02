import React, { Component } from 'react';
import {
  func, objectOf, any, bool,
} from 'prop-types';
import { TextField, Button, InputAdornment } from '@material-ui/core';
import { VerifiedUser, Lock, LockOpenOutlined } from '@material-ui/icons';
import PasswordPolicy from './PolicyPopover';
import { resolveIconClassName } from './Form';

const FORGOT = {
  CODE: 'code',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
};

class ForgotPassword extends Component {
  onChange = (event) => {
    const { handleChange, setFieldTouched } = this.props;
    event.preventDefault();
    const { value, name } = event.target;
    if (!/^\S+$/.test(value) && value.length) return;
    handleChange(event);
    setFieldTouched(name, true, false);
  };

  handleCancelResetPassword = () => {
    const { handleCloseModal } = this.props;
    handleCloseModal();
  };

  render() {
    const {
      values: {
        code,
        password,
        confirmPassword,
      },
      handleSubmit, touched, errors, isValid,
    } = this.props;
    const iconCode = resolveIconClassName(FORGOT.CODE, code, errors, touched);
    const iconPassword = resolveIconClassName(FORGOT.PASSWORD, password, errors, touched);
    const iconConfirmPassword = resolveIconClassName(FORGOT.CONFIRM_PASSWORD, confirmPassword, errors, touched);
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Code"
          name={FORGOT.CODE}
          onChange={this.onChange}
          value={code}
          className="form-control-holder"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <VerifiedUser className={iconCode} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="password"
          fullWidth
          label="New password"
          name={FORGOT.PASSWORD}
          onChange={this.onChange}
          value={password}
          className="form-control-holder"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {errors[FORGOT.PASSWORD] && touched[FORGOT.PASSWORD] && <PasswordPolicy />}
                <Lock className={iconPassword} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="password"
          fullWidth
          label="Confirm password"
          name={FORGOT.CONFIRM_PASSWORD}
          onChange={this.onChange}
          value={confirmPassword}
          className="form-control-holder"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {errors[FORGOT.CONFIRM_PASSWORD]
                  ? <LockOpenOutlined className={iconConfirmPassword} />
                  : <Lock className={iconConfirmPassword} />}
              </InputAdornment>
            ),
          }}
        />
        <div className="cta-buttons">
          <Button variant="outlined" onClick={this.handleCancelResetPassword}>Cancel</Button>
          <Button
            disabled={!isValid}
            type="submit"
            variant="outlined"
            className={isValid ? 'main-button-active' : ''}
          >
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

ForgotPassword.propTypes = {
  handleChange: func.isRequired,
  setFieldTouched: func.isRequired,
  handleSubmit: func.isRequired,
  values: objectOf(any).isRequired,
  isValid: bool.isRequired,
  errors: objectOf(any).isRequired,
  touched: objectOf(any).isRequired,
  handleCloseModal: func.isRequired,
};

export default ForgotPassword;
