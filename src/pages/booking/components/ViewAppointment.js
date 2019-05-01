import React, { Component } from 'react';
import {
  objectOf,
  any, func,
} from 'prop-types';
import {
  Typography,
  IconButton,
} from '@material-ui/core';
import { connect } from 'react-redux';
import {
  DateRange,
  Schedule,
  ViewList,
  Email,
  Call,
  Place,
  CheckCircle,
  Event,
  Share,
} from '@material-ui/icons';
import { get } from 'lodash';
import mtz from 'moment-timezone';
import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';
import { history } from 'containers/App';
import RateStar from 'components/Rating/RateStar';
import zeroPad from 'utils/zeroPad';
import {
  eventType,
  serviceType,
} from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import s from './ViewAppointment.module.scss';

const accounts = [{ google: 'Google' }];

class ViewAppointment extends Component {
  handleShareBooking = () => {
    console.log('sharing booking to friend');
  };

  handleViewAppointment = () => {
    const {
      resetBooking: resetBookingAction,
      userDetail: { userSub },
    } = this.props;
    resetBookingAction();
    history.push(`/profile/${userSub}`);
  };

  render() {
    const {
      appointmentEvent,
      bookingService,
      bookingDetail,
      userDetail,
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
    const email = get(userDetail, 'email');
    const serviceName = get(appointmentEvent, 'serviceName');
    const serviceDescription = get(bookingService, 'description');
    const startSec = get(appointmentEvent, 'slot.startSec');
    const duration = get(appointmentEvent, 'duration');
    const startTime = moment(startSec * 1000);
    const startYear = startTime.year();
    const startMonth = startTime.month() + 1;
    const startDate = startTime.date();
    const startHour = startTime.hour();
    const startMin = startTime.minutes();
    const startSecond = startTime.seconds();
    // eslint-disable-next-line
    const startString = `${startYear}-${zeroPad(startMonth, 2)}-${zeroPad(startDate, 2)}T${zeroPad(startHour, 2)}:${zeroPad(startMin, 2)}:${zeroPad(startSecond, 2)}`;
    const endTime = moment(startSec * 1000 + duration * 60000);
    const endYear = endTime.year();
    const endMonth = endTime.month() + 1;
    const endDate = endTime.date();
    const endHour = endTime.hour();
    const endMin = endTime.minutes();
    const endSecond = endTime.seconds();
    const timeZoneId = moment.tz.guess();
    // eslint-disable-next-line
    const endString = `${endYear}-${zeroPad(endMonth, 2)}-${zeroPad(endDate, 2)}T${zeroPad(endHour, 2)}:${zeroPad(endMin, 2)}:${zeroPad(endSecond, 2)}`;
    const addToCalendarTZ = moment(startString).tz(timeZoneId).format('z');
    const bookedEvent = {
      title: serviceName,
      description: serviceDescription,
      location: `${streetAddress}, ${district}, ${stateName}, ${city}, ${country}`,
      startTime: `${startString}${addToCalendarTZ}:00`,
      endTime: `${endString}${addToCalendarTZ}:00`,
    };

    return (
      <div className={s.viewAppointment}>
        <div className={s.viewTitle}>
          <div className={s.serviceName}>
            <Typography variant="title" color="textSecondary" className="text-bold">
              {appointmentEvent.serviceName}
            </Typography>
          </div>
          <div className={s.providerAddress}>
            <div className={s.providerName}>
              <Typography variant="title" color="inherit" className="text-bold text-margin-right">
                {appointmentEvent.providerName}
              </Typography>
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
          <div className={s.viewAppointmentCta}>
            <IconButton className="button-sm" onClick={this.handleViewAppointment}>
              <ViewList className="icon-main" />
            </IconButton>
            <Typography
              className="hover-pointer"
              onClick={this.handleViewAppointment}
              variant="subheading"
              color="inherit"
            >View appointment
            </Typography>
          </div>
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
              <Typography variant="title" className="danger-color">
                {bookingCode}
              </Typography>
            </div>
            <div className={s.viewItems}>
              <DateRange className="icon-main" />
              <Typography variant="body1" color="primary" inline noWrap>
                {mtz(appointmentEvent.slot.startSec * 1000).format(defaultDateFormat)}
              </Typography>
            </div>
            <div className={s.viewItems}>
              <Schedule className="icon-main" />
              <Typography variant="body1" color="primary" inline noWrap>
                {mtz(appointmentEvent.slot.startSec * 1000).format('LT')}{' - '}
                {mtz((appointmentEvent.slot.startSec + appointmentEvent.duration * 60) * 1000).format('LT')}
              </Typography>
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

ViewAppointment.propTypes = {
  appointmentEvent: eventType,
  bookingService: serviceType.isRequired,
  bookingDetail: objectOf(any).isRequired,
  userDetail: objectOf(any).isRequired,
  resetBooking: func.isRequired,
};

ViewAppointment.defaultProps = {
  appointmentEvent: undefined,
};

const mapStateToProps = state => ({
  ...state.booking,
  ...state.auth,
});

export default connect(mapStateToProps)(ViewAppointment);
