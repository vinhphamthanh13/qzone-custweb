import React, { Component } from 'react';
import {
  func,
  string,
  objectOf,
  bool,
  any,
} from 'prop-types';
import { get } from 'lodash';
import { withFormik } from 'formik';
import { TextField, InputAdornment } from '@material-ui/core';
import Recaptcha from 'react-recaptcha';
import { POPOVER_TYPE } from 'utils/constants';
import { clientInfo } from 'authentication/components/schemas';
import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/auth';
import PolicyPopover from 'authentication/components/PolicyPopover';
import s from './ClientInfo.module.scss';

class ClientInfo extends Component {
  static propTypes = {
    values: objectOf(string).isRequired,
    touched: objectOf(any).isRequired,
    setFieldValue: func.isRequired,
    handleBlur: func.isRequired,
    handleFormValidation: func.isRequired,
    errors: objectOf(string).isRequired,
    isValid: bool.isRequired,
    isInitialValid: bool,
    verifyCallback: func.isRequired,
    expiredCallback: func.isRequired,
    handleSubmit: func.isRequired,
    onloadCallback: func.isRequired,
  };

  static defaultProps = {
    // userDetail: null,
    // captchaVerified: false,
    isInitialValid: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail } = props;
    const { userDetail: cachedUserDetail } = state;

    if (userDetail !== cachedUserDetail) {
      return { userDetail };
    }

    return null;
  }

  state = {
    userDetail: null,
  };

  handleInput = (event) => {
    const {
      setFieldValue,
    } = this.props;
    if (event) event.preventDefault();
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  render() {
    const {
      values,
      handleSubmit,
      errors,
      isInitialValid,
      isValid,
      expiredCallback,
      verifyCallback,
      touched,
      handleBlur,
      handleFormValidation,
      onloadCallback,
    } = this.props;
    const {
      userDetail,
    } = this.state;

    const userName = get(values, 'userName') || '';
    const userEmail = get(values, 'userEmail') || '';
    const phoneNumber = get(values, 'phoneNumber') || '';
    handleFormValidation(isValid);

    return (
      <>
        <div className={s.formFields}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              autoFocus={!userDetail}
              disabled={userDetail}
              autoComplete
              name="userName"
              label="Client name"
              placeholder="Enter your name"
              onChange={this.handleInput}
              onBlur={handleBlur}
              value={userName}
              margin="dense"
              error={!!errors.userName && touched.userName}
              helperText={touched.userName && errors.userName}
            />
            <TextField
              fullWidth
              disabled={userDetail}
              autoComplete
              name="userEmail"
              label="Email address"
              placeholder="Enter your email address"
              onChange={this.handleInput}
              onBlur={handleBlur}
              value={userEmail}
              margin="dense"
              error={!!errors.userEmail && touched.userEmail}
              helperText={touched.userEmail && errors.userEmail}
            />
            <TextField
              fullWidth
              name="phoneNumber"
              disabled={userDetail}
              autoComplete
              label="Phone number"
              placeholder="Enter your phone number"
              onChange={this.handleInput}
              onBlur={handleBlur}
              value={phoneNumber}
              margin="dense"
              error={!!errors.phoneNumber && touched.phoneNumber}
              helperText={touched.phoneNumber && errors.phoneNumber}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {!!errors.phoneNumber && touched.phoneNumber && <PolicyPopover type={POPOVER_TYPE.TEL} />}
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
        {!userDetail && (isValid || isInitialValid) && (
          <div className={s.recaptcha}>
            <Recaptcha
              sitekey={GOOGLE_CAPTCHA_SITE_KEY}
              render="explicit"
              verifyCallback={verifyCallback}
              expiredCallback={expiredCallback}
              onloadCallback={onloadCallback}
            />
          </div>
        )}
      </>
    );
  }
}

export default withFormik({
  validationSchema: clientInfo,
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { userDetail } = props;
    const userName = get(userDetail, 'fullName');
    const userEmail = get(userDetail, 'email');
    const phoneNumber = get(userDetail, 'telephone');
    return {
      userName,
      userEmail,
      phoneNumber,
    };
  },
})(ClientInfo);
