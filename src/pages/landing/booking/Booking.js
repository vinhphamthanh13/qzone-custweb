import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { func, string } from 'prop-types';
import { Formik } from 'formik';
import moment from 'moment';
import { get } from 'lodash';
import { IconButton, Button, Input, InputLabel } from '@material-ui/core';
import {
  Email, PhoneIphone, Place, GpsFixed, Schedule, DateRange, NavigateBefore, Book, Fingerprint,
} from '@material-ui/icons';
// import Auth from 'pages/Auth';
import { limitString, navigateTo } from 'utils/common';
import { clientInfo } from 'authentication/components/schemas';
// import Recaptcha from 'react-recaptcha';
// import { GOOGLE_CAPTCHA_SITE_KEY } from 'config/auth';
import { ADDRESS_LENGTH, POPOVER_TYPE } from 'utils/constants';
import PolicyPopover from 'authentication/components/PolicyPopover';
import { bookingProps } from './commonProps';
import s from './Booking.module.scss';

class Booking extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {
    captchaVerified: false,
    userDetail: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { selectedBookingDetail, userDetail } = props;
    const { selectedBookingDetail: cachedBookingDetail, userDetail: cachedUserDetail  } = state;
    const updatedState = {};
    if (JSON.stringify(selectedBookingDetail) !== JSON.stringify(cachedBookingDetail)) {
      updatedState.selectedBookingDetail = selectedBookingDetail;
    }
    if (JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)) {
      updatedState.userDetail = userDetail;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  handleSelectProvider = (sId, sName, catName )=> () => {
    navigateTo(`/provider-by-service/${sId}`, { category: catName, service: sName })();
  };

  render() {
    const { selectedBookingDetail, userDetail, captchaVerified } = this.state;
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
    const startTime = moment(providerStartSec).format('HH:mm a');
    const endTime = moment(providerStartSec).add(60, 'minutes').format('HH:mm a');
    const catName = get(selectedBookingDetail, 'catName');
    const timezoneId = get(selectedBookingDetail, 'timezoneId');
    console.log('selected booking detail', selectedBookingDetail);
    console.log('selected userDetail detail', userDetail);

    return (
      <div className={s.container}>
        <div className={s.headline}>
          <IconButton color="inherit" onClick={this.handleSelectProvider(sId, sName, catName)}>
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
                {moment(providerStartSec).format('dddd, DD-MM-YYYY')}
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
              initialValues={{
                userName: cName,
                userEmail: cEmail,
                phoneNumber: cPhone,
              }}
              isInitialValid
              validationSchema={clientInfo}
              validateOnBlur
              onSubmit={(values) => {
                console.log('formik', values);
              }}
              render={props => {
                const { values, setFieldTouched, handleChange, errors, touched, isValid } = props;
                const userName = get(values, 'userName');
                const userEmail = get(values, 'userEmail');
                const phoneNumber = get(values, 'phoneNumber');
                const userId = get(userDetail, 'userSub');
                const isAuthUser = userId && isValid;
                const bookingValid = isAuthUser || captchaVerified;
                const loginValid = !(isAuthUser && captchaVerified);
                const ctaIcon = bookingValid ? <Book color="inherit" /> : <Fingerprint color="inherit" />;
                const ctaLabel = bookingValid ? 'book now!' : 'login';
                return (
                  <form onSubmit={props.handleSubmit}>
                    <div className={s.formControl}>
                      <InputLabel>Name</InputLabel>
                      <Input
                        placeholder="Your name"
                        type="text"
                        name="userName"
                        onBlur={() => setFieldTouched('userName', true)}
                        onChange={handleChange}
                        value={userName}
                      />
                      {touched.userName && errors.userName &&
                        <div className={s.errorMessage}>{props.errors.userName}</div>
                      }
                    </div>
                    <div className={s.formControl}>
                      <InputLabel>Email</InputLabel>
                      <Input
                        placeholder="Your email"
                        type="email"
                        name="userEmail"
                        onChange={handleChange}
                        onBlur={() => setFieldTouched('userEmail', true)}
                        value={userEmail}
                      />
                      {touched.userEmail && errors.userEmail &&
                        <div className={s.errorMessage}>{props.errors.userEmail}</div>
                      }
                    </div>
                    <div className={s.formControl}>
                      <InputLabel>Telephone</InputLabel>
                      <Input
                        placeholder="Your phone number"
                        type="tel"
                        name="phoneNumber"
                        onBlur={() => setFieldTouched('phoneNumber', true)}
                        onChange={handleChange}
                        value={phoneNumber}
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
                    <div className={s.bookingCta}>
                      <Button
                        disabled={!bookingValid && !loginValid}
                        className="simple-button"
                        variant="outlined"
                      >
                        {ctaIcon}<span>&nbsp;{ctaLabel}</span>
                      </Button>
                    </div>
                  </form>
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  bookingProps.mapStateToProps,
)(Booking);
