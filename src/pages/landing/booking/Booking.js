import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { Formik } from 'formik';
import moment from 'moment';
import { get, noop } from 'lodash';
import { IconButton, Button, Input, InputLabel } from '@material-ui/core';
import {
  Email, PhoneIphone, Place, GpsFixed, Schedule, DateRange, NavigateBefore, Book, Fingerprint,
} from '@material-ui/icons';
import Auth from 'pages/Auth';
import { limitString, navigateTo } from 'utils/common';
import { clientInfo } from 'authentication/components/schemas';
import Recaptcha from 'react-recaptcha';
import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/auth';
import Loading from 'components/Loading';
import Error from 'components/Error';
import CustomModal from 'components/Modal/CustomModal';
import { ADDRESS_LENGTH, POPOVER_TYPE, FULL_DATE, TIME_FORMAT } from 'utils/constants';
import PolicyPopover from 'authentication/components/PolicyPopover';
import { bookingProps } from '../../commonProps';
import s from './Booking.module.scss';

class Booking extends Component {
  static propTypes = {
    dispatchSaveGuestInfo: func.isRequired,
    dispatchBookEvent: func.isRequired,
    dispatchClearGuestError: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    captchaVerified: false,
    userDetail: {},
    isRegisterOpen: false,
    isLoginOpen: false,
    confirmBooking: false,
    loginSession: {},
    guestUserError: false,
    bookedEventDetail: {},
  };

  recaptcha = React.createRef();

  static getDerivedStateFromProps(props, state) {
    const {
      selectedBookingDetail, userDetail, loginSession, bookedEventDetail, landingPageFactors, guestUserError,
    } = props;
    const {
      selectedBookingDetail: cachedBookingDetail, userDetail: cachedUserDetail, loginSession: cachedLoginSession,
      bookedEventDetail: cachedBookedEventDetail, landingPageFactors: cachedLandingPageFactors,
      guestUserError: cachedGuestUserError,
    } = state;
    const updatedState = {};
    if (
      selectedBookingDetail !== null &&
      JSON.stringify(selectedBookingDetail) !== JSON.stringify(cachedBookingDetail)
    ) {
      updatedState.selectedBookingDetail = selectedBookingDetail;
    }
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }
    if (
      bookedEventDetail !== null &&
      JSON.stringify(bookedEventDetail) !== JSON.stringify(cachedBookedEventDetail)
    ) {
      updatedState.bookedEventDetail = bookedEventDetail;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }
    if (guestUserError !== cachedGuestUserError) {
      updatedState.guestUserError = guestUserError;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidUpdate(prevProps) {
    const { bookedEventDetail } = prevProps;
    const { dispatchClearGuestError } = this.props;
    const { bookedEventDetail: cachedBookedEventDetail, guestUserError } = this.state;
    if (
      bookedEventDetail !== null &&
      JSON.stringify(bookedEventDetail) !== JSON.stringify(cachedBookedEventDetail)
    ) {
      const bookedEventId = get(cachedBookedEventDetail, 'id');
      if (bookedEventId) {
        navigateTo(`/event/${bookedEventId}`)();
      }
    }
    if (guestUserError) {
      dispatchClearGuestError();
    }
  }

  handleSelectProvider = sId => () => {
    const { landingPageFactors } = this.state;
    const instantBooking = get(landingPageFactors, 'instantBooking');
    if (instantBooking) {
      const tId = get(landingPageFactors, 'tId');
      navigateTo(`/booking/instant/${tId}`)();
    } else {
      navigateTo(`/provider-by-service/${sId}`)();
    }
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  handleOpenLogin = () => {
    this.openAuthModal('isLoginOpen');
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleRegisterEvent = () => {
    const { dispatchBookEvent } = this.props;
    const { userDetail, selectedBookingDetail, loginSession } = this.state;
    this.toggleConfirmBooking();
    console.log(dispatchBookEvent);
    const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const duration = get(selectedBookingDetail, 'durationSec');
    const availabilityId = get(selectedBookingDetail, 'id');
    const startSec = get(selectedBookingDetail, 'providerStartSec');
    const authHeaders = get(loginSession, 'authHeaders');
    dispatchBookEvent({
      customerId, duration, availabilityId, startSec, status: 'UNSPECIFIED', type: 'APPOINTMENT',
    }, authHeaders);
  };

  toggleConfirmBooking = () => {
    this.setState(oldState => ({
      confirmBooking: !oldState.confirmBooking,
    }));
  };

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
    const {
      selectedBookingDetail, userDetail, captchaVerified, isRegisterOpen, isLoginOpen, confirmBooking, guestUserError,

    } = this.state;
    const waitListId = get(selectedBookingDetail, 'waitListId') || '';
    const cName = get(userDetail, 'givenName');
    const cEmail = get(userDetail, 'email');
    const cPhone = get(userDetail, 'telephone');
    const sName = get(selectedBookingDetail, 'sName');
    const sId = get(selectedBookingDetail, 'serviceId');
    const pName = get(selectedBookingDetail, 'pName');
    const pPhone = get(selectedBookingDetail, 'pPhone');
    const pEmail = get(selectedBookingDetail, 'pEmail');
    const pImage = get(selectedBookingDetail, 'pImage');
    const pAddress = get(selectedBookingDetail, 'pAddress');
    const durationSec = get(selectedBookingDetail, 'durationSec');
    const providerStartSec = get(selectedBookingDetail, 'providerStartSec');
    const startTime = moment(providerStartSec).format(TIME_FORMAT);
    const endTime = moment(providerStartSec).add(durationSec, 'minutes').format(TIME_FORMAT);
    const timezoneId = get(selectedBookingDetail, 'timezoneId');
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const navigateLeftCta = waitListId ? navigateTo('/') : this.handleSelectProvider(sId);

    return (
      <>
        <Loading />
        <Error />
        <CustomModal
          type="info"
          title="Booking confirmation"
          message="Do you want to book the event?"
          isOpen={confirmBooking}
          onClose={this.toggleConfirmBooking}
          okCallBack={this.handleRegisterEvent}
          cancelCallBack={this.toggleConfirmBooking}
          isBackDropClickDisabled
        />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
        />
        <div className={s.container}>
          <div className={s.headline}>
            <IconButton color="inherit" onClick={navigateLeftCta}>
              <NavigateBefore color="inherit" />
            </IconButton>
            <div className={s.title}>
              Booking confirmation
            </div>
          </div>
          <div className={s.confirmInfo}>
            <div className={s.details}>
              <div className={s.sName}>{sName}</div>
              <div className={s.content}>
                <div className={s.pImage}>
                  <img src={pImage} alt="Q Provider" width="100%" height="100%" />
                  <div className={s.duration}>
                    Duration: {`${durationSec}'`}
                  </div>
                </div>
                <div className={`${s.pName} ellipsis`}>{pName}</div>
                <div className={s.item}>
                  <DateRange className="icon-small" color="secondary" />
                  {moment(providerStartSec).format(FULL_DATE)}
                </div>
                <div className={s.item}>
                  <Schedule className="icon-small" color="secondary" />
                  {startTime} - {endTime}
                </div>
                <div className={s.item}><PhoneIphone className="icon-small" color="inherit" />{pPhone}</div>
                <div className={s.item}><Email className="icon-small" color="inherit" />{pEmail}</div>
                <div className={s.place}>
                  <Place className="icon-small" color="secondary" />
                  <span>&nbsp;{limitString(pAddress, ADDRESS_LENGTH)}</span>
                </div>
                <div className={s.item}><GpsFixed className="icon-small" color="inherit" />{timezoneId}</div>
              </div>
            </div>
            <div className={s.clientInfo}>
              <div className={s.clientTitle}>
                Client Information
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
                  const isAuthUser = userId && isValid;
                  const disableField = userId || captchaVerified;
                  const bookingValid = isAuthUser || captchaVerified;
                  const loginValid = !(isAuthUser && captchaVerified);
                  const ctaIcon = bookingValid
                    ? <Book color="inherit" className="icon-small" />
                    : <Fingerprint color="inherit" className="icon-small" />;
                  const ctaLabel = bookingValid ? 'book now!' : 'Proceed';
                  const ctaAction = !bookingValid && loginValid
                    ? this.handleOpenLogin
                    : this.toggleConfirmBooking;
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
                          disabled={!bookingValid && !loginValid}
                          className="simple-button"
                          variant="outlined"
                          onClick={ctaAction}
                          color="inherit"
                        >
                          {ctaIcon}{ctaLabel}
                        </Button>
                      </div>
                    </form>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  bookingProps.mapStateToProps,
  bookingProps.mapDispatchToProps,
)(Booking);
