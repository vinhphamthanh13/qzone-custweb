import React from 'react';
import {
  func, arrayOf, objectOf, any,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import {
  DateRange, Schedule, ViewList, EmailOutlined, CallOutlined, PlaceOutlined,
  CheckCircle, Event, Share,
} from '@material-ui/icons';
import { get } from 'lodash';
import mtz from 'moment-timezone';
import RateStar from 'components/Rating/RateStar';
import { eventType, serviceType, bookingDetailType } from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import s from './ViewAppointment.module.scss';

const handleAddBookingToCalendar = () => {
  console.log('adding booking to googleCalener');
};

const handleShareBooking = () => {
  console.log('sharing booking to friend');
};

const ViewAppointment = ({
  bookingEvent, handleOpenProfile, initService, bookingDetail, providerList, userDetail,
}) => {
  const provider = get(bookingDetail, 'provider');
  const stateName = get(bookingEvent, 'geoLocation.state');
  const bookingCode = get(bookingEvent, 'bookingCode');
  const city = get(bookingEvent, 'geoLocation.city');
  const country = get(bookingEvent, 'geoLocation.country');
  const district = get(bookingEvent, 'geoLocation.district');
  const postCode = get(bookingEvent, 'geoLocation.postCode');
  const streetAddress = get(bookingEvent, 'geoLocation.streetAddress');
  const providerEmail = get(provider, 'email');
  const providerPhone = get(provider, 'telephone');
  const providerWebsite = get(provider, 'website');
  const serviceProvider = providerList
    .filter(item => item.providerId === provider.id && item.serviceId === initService.id);
  const providerRating = get(serviceProvider, '0.rating');
  const email = get(userDetail, 'email');

  return (
    <div className={s.viewAppointment}>
      <div className={s.viewTitle}>
        <div className={s.serviceName}>
          <Typography variant="title" color="textSecondary" className="text-bold">
            {bookingEvent.serviceName}
          </Typography>
        </div>
        <div className={s.providerAddress}>
          <div className={s.providerName}>
            <Typography variant="title" color="inherit" className="text-bold text-margin-right">
              {bookingEvent.providerName}
            </Typography>
            <RateStar rating={providerRating} />
          </div>
          <div className={s.providerAddress}>
            <div className={s.addressItems}>
              <EmailOutlined className="icon-small icon-brand" />
              <Typography noWrap variant="body2" color="textSecondary">{providerEmail}</Typography>
            </div>
            <div className={s.addressItems}>
              <CallOutlined className="icon-small icon-brand" />
              <Typography noWrap variant="body2" color="textSecondary">{providerPhone}</Typography>
            </div>
            <div className={s.addressItems}>
              <PlaceOutlined className="icon-small icon-brand" />
              <Typography noWrap variant="body2" color="textSecondary">
                {streetAddress}, {district}
              </Typography>
            </div>
            <div className={s.addressItems}>
              <PlaceOutlined className="icon-small icon-transparent" />
              <Typography noWrap variant="body2" color="textSecondary">
                {stateName}, {city}
              </Typography>
            </div>
            <div className={s.addressItems}>
              <PlaceOutlined className="icon-small icon-transparent" />
              <Typography noWrap variant="body2" color="textSecondary">
                {country}, {postCode}
              </Typography>
            </div>
            <div className={s.addressItems}>
              <PlaceOutlined className="icon-small icon-transparent" />
              <Typography noWrap variant="body2" color="textSecondary">
                {providerWebsite || 'https://info.quezone.com.au'}
              </Typography>
            </div>
          </div>
        </div>
        <div className={s.viewAppointmentCta}>
          <IconButton className="button-sm" onClick={handleOpenProfile}>
            <ViewList className="icon-main" />
          </IconButton>
          <Typography
            className="hover-pointer"
            onClick={handleOpenProfile}
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
            <Typography variant="subtitle2" color="secondary">
              {bookingCode}
            </Typography>
          </div>
          <div className={s.viewItems}>
            <DateRange className="icon-main" />
            <Typography variant="body1" color="primary" inline noWrap>
              {mtz(bookingEvent.slot.startSec * 1000).format(defaultDateFormat)}
            </Typography>
          </div>
          <div className={s.viewItems}>
            <Schedule className="icon-main" />
            <Typography variant="body1" color="primary" inline noWrap>
              {mtz(bookingEvent.slot.startSec * 1000).format('LT')}{' - '}
              {mtz((bookingEvent.slot.startSec + bookingEvent.duration * 60) * 1000).format('LT')}
            </Typography>
          </div>
        </div>
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
              <IconButton className="simple-button button-sm" onClick={handleAddBookingToCalendar}>
                <Event className="icon-main" />
              </IconButton>
              <Typography variant="caption" color="textSecondary">Add to calendar</Typography>
            </div>
            <div className={s.shareBooking}>
              <IconButton className="simple-button button-sm" onClick={handleShareBooking}>
                <Share className="icon-main" />
              </IconButton>
              <Typography variant="caption" color="textSecondary">Share</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewAppointment.propTypes = {
  bookingEvent: eventType,
  handleOpenProfile: func.isRequired,
  initService: serviceType.isRequired,
  bookingDetail: bookingDetailType.isRequired,
  providerList: arrayOf(any).isRequired,
  userDetail: objectOf(any).isRequired,
};

ViewAppointment.defaultProps = {
  bookingEvent: undefined,
};

const mapStateToProps = state => ({
  providerList: state.home.providerList,
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps)(React.memo(ViewAppointment));
