import React, { Component } from 'react';
import { func, string, objectOf, bool, any } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get, noop } from 'lodash';
import { withFormik } from 'formik';
import { TextField, InputAdornment } from '@material-ui/core';
import Recaptcha from 'react-recaptcha';
import { POPOVER_TYPE } from 'utils/constants';
import { clientInfo } from 'authentication/components/schemas';
import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/auth';
import PolicyPopover from 'authentication/components/PolicyPopover';
import { clearGuestErrorAction } from 'authentication/actions/login';
import s from './ClientInfo.module.scss';

class ClientInfo extends Component {
  static propTypes = {
    values: objectOf(string).isRequired,
    touched: objectOf(any).isRequired,
    setFieldValue: func.isRequired,
    handleSubmit: func.isRequired,
    errors: objectOf(string).isRequired,
    isValid: bool.isRequired,
    isInitialValid: bool,
    verifyCallback: func.isRequired,
    expiredCallback: func.isRequired,
    onloadCallback: func.isRequired,
    handleFormValidation: func,
    clearGuestErrorAction: func.isRequired,
  };

  static defaultProps = {
    isInitialValid: false,
    handleFormValidation: noop,
  };

  state = {
    userDetail: null,
    guestUserError: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail, guestUserError } = props;
    const { userDetail: cachedUserDetail, guestUserError: cachedGuestUserError } = state;
    const updatedState = {};
    if (JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)) {
      updatedState.userDetail = userDetail;
    }
    if (guestUserError !== cachedGuestUserError) {
      updatedState.guestUserError = guestUserError;
    }

    return Object.keys(updatedState).length ? updatedState : null;
  }

  recaptcha = React.createRef();

  componentDidUpdate() {
    const { clearGuestErrorAction: clearGuestError } = this.props;
    const {
      guestUserError,
    } = this.state;
    if (guestUserError) {
      clearGuestError();
      if (this.recaptcha.current) {
        this.recaptcha.current.reset();
      }
    }
  }

  handleChange = (event) => {
    const { setFieldValue } = this.props;
    if (event) event.preventDefault();
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  handleVerifiedCaptcha = (response) => {
    const {
      verifyCallback,
      values,
    } = this.props;
    const email = get(values, 'userEmail');
    const givenName = get(values, 'userName');
    const phone = get(values, 'phoneNumber');
    verifyCallback(response, {
      givenName,
      email,
      phone,
      userType: 'GUEST',
    });
  };

  render() {
    const {
      values, handleSubmit, errors, isInitialValid, isValid, expiredCallback, touched, onloadCallback,
      handleFormValidation,
    } = this.props;
    const { userDetail } = this.state;

    const userName = get(values, 'userName') || '';
    const userEmail = get(values, 'userEmail') || '';
    const phoneNumber = get(values, 'phoneNumber') || '';
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    handleFormValidation(isValid);

    return (
      <div className={s.formFields}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            autoFocus={!userDetail}
            disabled={!!userId}
            name="userName"
            label="Client name"
            placeholder="Enter your name"
            onChange={this.handleChange}
            value={userName}
            margin="dense"
            error={!!errors.userName && touched.userName}
            helperText={touched.userName && errors.userName}
          />
          <TextField
            fullWidth
            type="email"
            disabled={!!userId}
            name="userEmail"
            label="Email address"
            placeholder="Enter your email address"
            onChange={this.handleChange}
            value={userEmail}
            margin="dense"
            error={!!errors.userEmail && touched.userEmail}
            helperText={touched.userEmail && errors.userEmail}
          />
          <TextField
            fullWidth
            type="tel"
            name="phoneNumber"
            disabled={!!userId}
            label="Phone number"
            placeholder="Enter your phone number"
            onChange={this.handleChange}
            value={phoneNumber}
            margin="dense"
            error={!!errors.phoneNumber && touched.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!!errors.phoneNumber && touched.phoneNumber ? <PolicyPopover type={POPOVER_TYPE.TEL} /> : ''}
                </InputAdornment>
              ),
            }}
          />
        </form>
        {!userDetail && (isValid || isInitialValid) && (
          <div className={s.recaptcha}>
            <Recaptcha
              ref={this.recaptcha}
              sitekey={GOOGLE_CAPTCHA_SITE_KEY}
              render="explicit"
              verifyCallback={this.handleVerifiedCaptcha}
              expiredCallback={expiredCallback}
              onloadCallback={onloadCallback}
            />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  withFormik({
    validationSchema: clientInfo,
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { userDetail } = props;
      const userName = get(userDetail, 'givenName');
      const userEmail = get(userDetail, 'email');
      const phoneNumber = get(userDetail, 'telephone');
      return {
        userName,
        userEmail,
        phoneNumber,
      };
    },
  }),
  connect(state => ({
    ...state.auth,
  }), {
    clearGuestErrorAction,
  }),
)(ClientInfo);
