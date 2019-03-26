import React from 'react';
import { func } from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import {
  DateRange, Schedule, ViewList, EmailOutlined, CallOutlined, PlaceOutlined,
} from '@material-ui/icons';
import { get } from 'lodash';
import mtz from 'moment-timezone';
import RateStar from 'components/Rating/RateStar';
import { eventType, serviceType, bookingDetailType } from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import s from './ViewAppointment.module.scss';

const ViewAppointment = ({
  bookingEvent, handleOpenProfile, initService, bookingDetail,
}) => {
  const provider = get(bookingDetail, 'provider');
  const stateName = get(bookingEvent, 'geoLocation.state');
  const bookingCode = get(bookingEvent, 'bookingCode');
  const city = get(bookingEvent, 'geoLocation.city');
  const country = get(bookingEvent, 'geoLocation.country');
  const district = get(bookingEvent, 'geoLocation.district');
  const postCode = get(bookingEvent, 'geoLocation.postCode');
  const streetAddress = get(bookingEvent, 'geoLocation.streetAddress');
  const providerRating = get(bookingEvent, 'rating');
  const providerEmail = get(provider, 'email');
  const providerPhone = get(provider, 'telephone');
  const providerWebsite = get(provider, 'website');

  return (
    <div className={s.viewAppointment}>
      <div className={s.viewTitle}>
        <div className={s.serviceName}>
          <Typography variant="title" color="textSecondary">
            {bookingEvent.serviceName}
          </Typography>
          <RateStar reviews={initService.viewNum} rating={initService.rating} />
        </div>
        <div className={s.viewAppointmentCta}>
          <IconButton className="button-sm" onClick={handleOpenProfile}>
            <ViewList className="icon-main icon-shake" />
          </IconButton>
          <Typography
            className="hover-pointer"
            onClick={handleOpenProfile}
            variant="subheading"
            color="inherit"
          >View appointment list
          </Typography>
        </div>
      </div>
      <div className={s.appointmentDetail}>
        <div className={s.bookedInfo}>
          <Typography variant="title" color="inherit">Booking Summary</Typography>
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
        <div className={s.providerAddress}>
          <div className={s.providerName}>
            <Typography variant="title" color="inherit" className="text-bold">
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
      </div>
    </div>
  );
};

ViewAppointment.propTypes = {
  bookingEvent: eventType,
  handleOpenProfile: func.isRequired,
  initService: serviceType.isRequired,
  bookingDetail: bookingDetailType.isRequired,
};

ViewAppointment.defaultProps = {
  bookingEvent: undefined,
};

export default React.memo(ViewAppointment);
