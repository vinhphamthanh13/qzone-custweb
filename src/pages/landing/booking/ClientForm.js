import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import noop from 'lodash/noop';
import { clientInfo } from 'authentication/components/schemas';
import get from 'lodash/get';
import { CheckCircle, PersonAdd, ChevronRight } from '@material-ui/icons';
import { Button, Input, InputLabel, Checkbox } from '@material-ui/core';
import PolicyPopover from 'authentication/components/PolicyPopover';
import { POPOVER_TYPE, TERMS_AND_CONDITIONS } from 'utils/constants';
import Recaptcha from 'react-recaptcha';
import { clientInfoProps } from 'pages/commonProps';
import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/auth';
import s from './ClientForm.module.scss';

class ClientInfo extends Component {
  static propTypes = {
    onLogin: func.isRequired,
    onConfirmCta: func,
    dispatchSaveGuestInfo: func.isRequired,
    dispatchClearGuestError: func.isRequired,
  };

  static defaultProps = {
    onConfirmCta: noop,
  };

  state = {
    userDetail: {},
    captchaVerified: false,
    guestUserError: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail, guestUserError } = props;
    const {
      userDetail: cachedUserDetail,
      guestUserError: cachedGuestUserError,
    } = state;
    const updatedState = {};
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (guestUserError !== cachedGuestUserError) {
      updatedState.guestUserError = guestUserError;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidUpdate() {
    const { dispatchClearGuestError } = this.props;
    const { guestUserError } = this.state;
    if (guestUserError) {
      dispatchClearGuestError();
    }
  }

  handleVerifiedCaptcha = values => response => {
    const { dispatchSaveGuestInfo } = this.props;
    const email = get(values, 'userEmail');
    const givenName = get(values, 'userName');
    const phone = get(values, 'phoneNumber');
    if (response) {
      dispatchSaveGuestInfo({
        givenName,
        email,
        phone,
        userType: 'GUEST',
      }, this.handleValidatingCaptcha(true));
    }
  };

  handleValidatingCaptcha = value => () => {
    this.setState({
      captchaVerified: value,
    });
  };


  render() {
    const { onLogin, onConfirmCta } = this.props;
    const { userDetail, captchaVerified, guestUserError } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const cName = get(userDetail, 'givenName');
    const cEmail = get(userDetail, 'email');
    const cPhone = get(userDetail, 'telephone');
    return (
      <div className={s.container}>
        {!userId && (
          <div className={s.userRegistration}>
            <div className={s.leftInfo}>
              <div className={s.clientTitle}>
                Don&apos;t have account?
              </div>
              <div className={s.infoGuide}>
                Please enter a few details below to proceed. Register with <strong>QUEZONE</strong> and you won&apos;t
                need to enter this data again.
              </div>
              <Formik
                onSubmit={noop}
                initialValues={{
                  userName: cName,
                  userEmail: cEmail,
                  phoneNumber: cPhone,
                }}
                isInitialValid={!!userId}
                validationSchema={clientInfo}
                validateOnBlur
                render={props => {
                  const { values, setFieldTouched, handleChange, errors, touched, isValid } = props;
                  const userName = get(userDetail, 'givenName') || get(values, 'userName');
                  const userEmail = get(userDetail, 'email') || get(values, 'userEmail');
                  const phoneNumber = get(userDetail, 'telephone') || get(values, 'phoneNumber');
                  const termAndCond = get(values, 'termAndCondition') || false;
                  const agreeRegistration = get(values, 'agreeRegistration') || false;
                  const disableField = userId || captchaVerified;

                  return (
                    <form className={s.formData}>
                      <div className={s.formControl}>
                        <InputLabel className={s.label}>Name</InputLabel>
                        <Input
                          placeholder="Your name"
                          type="text"
                          name="userName"
                          onBlur={() => setFieldTouched('userName', true)}
                          onChange={handleChange}
                          value={userName}
                          disabled={!!disableField}
                          margin="dense"
                        />
                        {touched.userName && errors.userName &&
                        <div className={s.errorMessage}>{props.errors.userName}</div>
                        }
                      </div>
                      <div className={s.formControl}>
                        <InputLabel className={s.label}>Email</InputLabel>
                        <Input
                          placeholder="Your email"
                          type="email"
                          name="userEmail"
                          onChange={handleChange}
                          onBlur={() => setFieldTouched('userEmail', true)}
                          value={userEmail}
                          disabled={!!disableField}
                          margin="dense"
                        />
                        {touched.userEmail && errors.userEmail &&
                        <div className={s.errorMessage}>{props.errors.userEmail}</div>
                        }
                      </div>
                      <div className={s.formControl}>
                        <InputLabel className={s.label}>Telephone</InputLabel>
                        <Input
                          placeholder="Your phone number"
                          type="tel"
                          name="phoneNumber"
                          onBlur={() => setFieldTouched('phoneNumber', true)}
                          onChange={handleChange}
                          value={phoneNumber}
                          disabled={!!disableField}
                          margin="dense"
                        />
                        {touched.phoneNumber && errors.phoneNumber &&
                        <div className={s.errorMessage}>{props.errors.phoneNumber}</div>
                        }
                        {touched.phoneNumber && errors.phoneNumber && (
                          <div className={s.popOver}>
                            <PolicyPopover type={POPOVER_TYPE.TEL} />
                          </div>
                        )}
                      </div>
                      <div className={s.guestRegistration}>
                        <div className={s.termAndCondition}>
                          <Checkbox
                            className="q-checkbox"
                            color="primary"
                            name="termAndCondition"
                            checked={termAndCond}
                            value="termAndCondition"
                            onChange={handleChange}
                          />
                          <div className={s.tncLabel}>Agree to&nbsp;
                            <a href={TERMS_AND_CONDITIONS} target="_blank" rel="noopener noreferrer">
                              Terms and Conditions
                            </a>
                          </div>
                        </div>
                        <div className={s.termAndCondition}>
                          <Checkbox
                            className="q-checkbox"
                            color="primary"
                            name="agreeRegistration"
                            checked={agreeRegistration}
                            value="agreeRegistration"
                            onChange={handleChange}
                          />
                          <div className={s.tncLabel}>I would like to register and proceed as a User</div>
                        </div>
                      </div>
                      {isValid && !userId && !guestUserError && (
                        <div className={s.recaptcha}>
                          <Recaptcha
                            ref={this.recaptcha}
                            sitekey={GOOGLE_CAPTCHA_SITE_KEY}
                            render="explicit"
                            verifyCallback={this.handleVerifiedCaptcha(values)}
                            expiredCallback={this.handleValidatingCaptcha(false)}
                            onloadCallback={this.handleValidatingCaptcha(false)}
                          />
                        </div>
                      )}
                      <div className={s.bookingCta}>
                        <Button
                          disabled={!captchaVerified}
                          className="simple-button"
                          variant="outlined"
                          color="inherit"
                        >
                          <PersonAdd color="inherit" className="icon-small" />
                          <span>&nbsp;Proceed as guest</span>
                        </Button>
                      </div>
                    </form>
                  );
                }}
              />
            </div>
            <div className={s.rightInfo}>
              <div className={s.clientTitle}>
                Existing user?
              </div>
              { /* eslint-disable-next-line */ }
              <div className={s.existingUser} onClick={onLogin}>
                <span>Sign in with <strong>QUEZONE</strong> <i><u>Username</u></i> and <i><u>Password</u></i>
                  &nbsp;
                </span>
                <ChevronRight color="secondary" className="icon-small hover-bright icon-shake" />
              </div>
            </div>
          </div>
        )}
        {userId && (
          <div className={s.userInfo}>
            <div className={s.clientTitle}>
              Your booking information
            </div>
            <div className={`${s.infoGuide} success-color`}>
              Booking schedule will be confirmed via below information. Could you check your email for details?
            </div>
            <Formik
              onSubmit={noop}
              initialValues={{
                userName: cName,
                userEmail: cEmail,
                phoneNumber: cPhone,
              }}
              isInitialValid={!!userId}
              validationSchema={clientInfo}
              validateOnBlur
              render={props => {
                const { values } = props;
                const userName = get(userDetail, 'givenName') || get(values, 'userName');
                const userEmail = get(userDetail, 'email') || get(values, 'userEmail');
                const phoneNumber = get(userDetail, 'telephone') || get(values, 'phoneNumber');
                const disableField = userId || captchaVerified;
                return (
                  <form className={s.formData}>
                    <div className={s.formControl}>
                      <InputLabel className={s.label}>Name</InputLabel>
                      <Input
                        name="userName"
                        value={userName}
                        disabled={!!disableField}
                      />
                    </div>
                    <div className={s.formControl}>
                      <InputLabel className={s.label}>Email</InputLabel>
                      <Input
                        name="userEmail"
                        value={userEmail}
                        disabled={!!disableField}
                      />
                    </div>
                    <div className={s.formControl}>
                      <InputLabel className={s.label}>Telephone</InputLabel>
                      <Input
                        name="phoneNumber"
                        value={phoneNumber}
                        disabled={!!disableField}
                      />
                    </div>
                    <div className={s.bookingCta}>
                      <Button className="simple-button" variant="outlined" onClick={onConfirmCta} color="inherit">
                        <CheckCircle color="inherit" className="icon-small" />
                        <span>&nbsp;Book now</span>
                      </Button>
                    </div>
                  </form>
                );
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  clientInfoProps.mapStateToProps,
  clientInfoProps.mapDispatchToProps,
)(ClientInfo);
