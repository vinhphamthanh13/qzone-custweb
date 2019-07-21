import React, { Component } from 'react';
import {
  objectOf,
  any,
  func,
  bool,
} from 'prop-types';
import {
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  DateRange,
  AvTimer,
  ViewList,
  Email,
  Call,
  Place,
  CheckCircle,
  Event,
  Share,
  Public,
} from '@material-ui/icons';
import { get } from 'lodash';
import moment from 'moment';
import momentum from 'moment-timezone';
import AddToCalendar from 'react-add-to-calendar';
import { history } from 'containers/App';
import CustomLink from 'components/CustomLink';
import RateStar from 'components/Rating/RateStar';
import {
  eventType,
  serviceType,
} from 'types/global';
import { goProfilePage } from 'actionsReducers/profile.actions';
import {
  defaultDateFormat,
  timeSlotFormat,
  PROFILE,
} from 'utils/constants';
import s from './ViewAppointment.module.scss';

const accounts = [{ google: 'Google' }];

class ViewAppointment extends Component {
  static propTypes = {
    appointmentEvent: eventType,
    bookingService: serviceType.isRequired,
    bookingDetail: objectOf(any).isRequired,
    userDetail: objectOf(any).isRequired,
    resetBooking: func.isRequired,
    goProfilePage: func.isRequired,
    showPage: bool.isRequired,
  };

  static defaultProps = {
    appointmentEvent: undefined,
  };

  handleShareBooking = () => {
    console.log('sharing booking to friend');
  };

  handleViewAppointment = () => {
    const {
      resetBooking: resetBookingAction,
      userDetail,
      goProfilePage: goProfilePageAction,
    } = this.props;
    const userSub = get(userDetail, 'userSub') || get(userDetail, 'id');
    resetBookingAction();
    goProfilePageAction(PROFILE.PAGE.EVENT_LIST);
    history.push(`/profile/${userSub}`);
  };

  render() {
    const {
      appointmentEvent,
      bookingService,
      bookingDetail,
      userDetail,
      showPage,
    } = this.props;
    const provider = get(bookingDetail, 'provider');
    const bookingCode = get(appointmentEvent, 'bookingCode');
    const stateName = get(appointmentEvent, 'geoLocation.state');
    const city = get(appointmentEvent, 'geoLocation.city');
    const country = get(appointmentEvent, 'geoLocation.country');
    const district = get(appointmentEvent, 'geoLocation.district');
    const postCode = get(appointmentEvent, 'geoLocation.postCode');
    const streetAddress = get(appointmentEvent, 'geoLocation.streetAddress');
    const providerEmail = get(provider, 'email');
    const providerPhone = get(provider, 'telephone');
    const providerWebsite = get(provider, 'website');
    const providerRating = get(provider, 'rating');
    const providerGivenName = get(provider, 'givenName');
    const providerFamilyName = get(provider, 'familyName');
    const providerId = get(provider, 'userSub');
    const email = get(userDetail, 'email');
    const serviceName = get(appointmentEvent, 'serviceName');
    const serviceDescription = get(bookingService, 'description');
    const providerStartSec = get(appointmentEvent, 'providerStartSec') || '';
    const startTimeSec = moment(providerStartSec.replace(/\..*/, '')).unix();
    const duration = get(appointmentEvent, 'duration');
    const providerTimezoneId = get(appointmentEvent, 'timezone');
    const timeZoneId = momentum.tz.guess();
    const addToCalendarTZ = moment(startTimeSec * 1000).tz(timeZoneId).format('Z');
    const bookedEvent = {
      title: serviceName,
      description: serviceDescription,
      location: `${streetAddress}, ${city}, ${stateName} ${postCode}, ${country}`,
      startTime: `${moment(startTimeSec * 1000).format('YYYY-MM-DDTHH:mm:ss')}${addToCalendarTZ}`,
      endTime: `${moment(startTimeSec * 1000).add(duration, 'm').format('YYYY-MM-DDTHH:mm:ss')}${addToCalendarTZ}`,
    };
    const viewAppointmentStyle = showPage ? s.viewAppointmentPage : s.viewAppointment;
    return (
      <div className={viewAppointmentStyle}>
        <div className={s.viewTitle}>
          <div className={s.serviceName}>
            <Typography
              variant="title"
              color="textSecondary"
              className="text-bold"
              noWrap
            >
              {appointmentEvent.serviceName}
            </Typography>
          </div>
          <div className={s.providerAddress}>
            <div className={s.providerNameRating}>
              <div className={s.providerName}>
                <Typography
                  variant="title"
                  color="inherit"
                  className="text-bold"
                  noWrap
                >
                  <CustomLink
                    text={`${providerGivenName} ${providerFamilyName}`}
                    to={`/provider/${providerId}`}
                    className="main-color-04"
                    big
                  />
                </Typography>
              </div>
              <RateStar rating={providerRating} />
            </div>
            <div className={s.providerAddress}>
              <div className={s.addressItems}>
                <Email className="icon-small icon-brand" />
                <Typography noWrap variant="body2" color="textSecondary">{providerEmail}</Typography>
              </div>
              <div className={s.addressItems}>
                <Call className="icon-small icon-brand" />
                <Typography noWrap variant="body2" color="textSecondary">{providerPhone}</Typography>
              </div>
              <div className={s.addressItems}>
                <Place className="icon-small icon-brand" />
                <Typography noWrap variant="body2" color="textSecondary">
                  {streetAddress}, {district}
                </Typography>
              </div>
              <div className={s.addressItems}>
                <Place className="icon-small icon-transparent" />
                <Typography noWrap variant="body2" color="textSecondary">
                  {stateName}, {city}
                </Typography>
              </div>
              <div className={s.addressItems}>
                <Place className="icon-small icon-transparent" />
                <Typography noWrap variant="body2" color="textSecondary">
                  {country}, {postCode}
                </Typography>
              </div>
              <div className={s.addressItems}>
                <Place className="icon-small icon-transparent" />
                <Typography noWrap variant="body2" color="textSecondary">
                  {providerWebsite || 'https://info.quezone.com.au'}
                </Typography>
              </div>
            </div>
          </div>
          <Button
            className={`${s.viewAppointmentCta} main-button`}
            variant="outlined"
            onClick={this.handleViewAppointment}
          >
            <ViewList className="icon-in-button-left" />
            <Typography
              className="hover-pointer"
              variant="subheading"
              color="inherit"
            >View appointment
            </Typography>
          </Button>
        </div>
        <div className={s.appointmentDetail}>
          <div className={s.bookingConfirmedIcon}>
            <CheckCircle className="icon-big fruit-color" />
          </div>
          <div className={s.bookedInfo}>
            <Typography variant="title" color="inherit" className="text-bold">Booking Confirmation</Typography>
          </div>
          <div className={s.appointmentInfo}>
            <div className={s.appointmentCode}>
              <Typography variant="subtitle2" color="primary" className="icon-main">Booking code:{' '}</Typography>
              <Typography variant="subtitle1" className="danger-color text-bold">
                {bookingCode.toUpperCase()}
              </Typography>
            </div>
            <div className={s.detailWrapper}>
              <div className={s.bookedDetail}>
                <div className={s.viewItems}>
                  <DateRange className="icon-small" />
                  <Typography variant="body1" color="primary" inline noWrap>
                    {moment(startTimeSec * 1000).format(defaultDateFormat)}
                  </Typography>
                </div>
                <div className={s.viewItems}>
                  <AvTimer className="icon-small" />
                  <Typography variant="body1" color="primary" inline noWrap>
                    {moment(startTimeSec * 1000).format(timeSlotFormat)}{' - '}
                    {moment(startTimeSec * 1000).add(duration, 'm').format(timeSlotFormat)}
                  </Typography>
                </div>
                <div className={s.viewItems}>
                  <Public className="icon-small" />
                  <Typography variant="body1" className="danger-color" inline noWrap>
                    {providerTimezoneId}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          {email && (
            <div className={s.postCta}>
              <div className={s.postEmail}>
                <Typography variant="body1" color="textSecondary" className="text-bold">
                  Your confirmation sent to
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {email}
                </Typography>
              </div>
              <div className={s.socialCta}>
                <div className={s.addCalendar}>
                  <IconButton className="simple-button button-sm">
                    <Event className="icon-main" />
                  </IconButton>
                  <AddToCalendar
                    buttonLabel="Add to calendar"
                    buttonClassOpen={s.buttonAddCalOpen}
                    buttonClassClosed={s.buttonAddCalClosed}
                    buttonWrapperClass={s.buttonAddCalWrapper}
                    displayItemIcons={false}
                    dropdownClass={s.buttonAddCalDropdown}
                    event={bookedEvent}
                    listItems={accounts}
                    rootClass={s.addToCalendar}
                    buttonTemplate={{
                      textOnly: 'none',
                    }}
                  />
                </div>
                <div className={s.shareBooking}>
                  <IconButton className="simple-button button-sm" onClick={this.handleShareBooking}>
                    <Share className="icon-main" />
                  </IconButton>
                  <Typography variant="caption" color="textSecondary">Share</Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.booking,
  ...state.auth,
});

export default connect(mapStateToProps, {
  goProfilePage,
})(ViewAppointment);
