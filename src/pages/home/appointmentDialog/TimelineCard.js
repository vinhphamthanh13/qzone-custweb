import React, { Component } from 'react';
import {
  shape, string, number, objectOf, any, func, arrayOf,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import { IconButton, Typography } from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange, Schedule, AlarmOff, AlarmOn,
  AirlineSeatReclineNormal, DoneAll,
  Update, Timer,
  PersonPin,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import Rating from 'material-ui-rating';
import styles from './TimelineCard.module.scss';
import CountDownDisplay from './CountDownDisplay';
import { STATUS } from './Appointment.constants';

class TimelineCard extends Component {
  state = {
    isOpenMap: false,
  };

  handleCustomerRating = (customerId, serviceProviderId) => (rating) => {
    const { rateAppointmentAction } = this.props;
    rateAppointmentAction({
      customerId,
      serviceProviderId,
      rating,
    });
  };

  handleToggleMap = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  render() {
    const {
      serviceName, providerName, slot: {
        startSec, toSec, providerId, serviceId,
      },
      duration,
      geoLocation: {
        city, country,
        district, postCode, state,
        streetAddress,
      },
      bookingCode,
      providerList,
      customerId,
      geoLocation,
    } = this.props;
    const { isOpenMap } = this.state;
    const toSecCalc = (toSec || startSec + duration * 60) * 1000;
    const current = new Date();
    const currentSec = current.getTime() / 1000;
    const remainTimeSec = currentSec - (+startSec);
    const [eventStyle, iconTimeline, eventStatus, iconStatus, styleStatus] = remainTimeSec > 0
      ? [
        { background: 'rgb(61, 63, 66)', color: '#fff' },
        <AlarmOff />,
        STATUS.EXPIRED,
        <DoneAll className="icon-main danger-color" />,
        styles.eventStatusComplete,
      ] : [
        { background: 'rgb(87, 201, 249)', color: '#fff' },
        <AlarmOn />,
        STATUS.WAITING,
        <AirlineSeatReclineNormal className="icon-main" />,
        styles.eventStatusWaiting,
      ];

    const remainTimeHr = remainTimeSec < 0 ? Math.abs(remainTimeSec) / 3600 : 0;
    const remainDay = remainTimeHr > 24 ? remainTimeHr / 24 : 0;
    const remainTimeMn = (remainTimeHr % 1) * 60;
    const waitingDay = parseInt(remainDay, 0);
    const waitingHr = waitingDay ? parseInt((remainDay % 1) * 24, 0) : parseInt(remainTimeHr, 0);
    const waitingMn = parseInt(remainTimeMn, 0);
    const serviceProvider = providerList
      .filter(item => item.providerId === providerId && item.serviceId === serviceId);
    const serviceProviderId = get(serviceProvider, '0.id');
    const providerRating = get(serviceProvider, '0.rating');

    let displayTimeout = null;
    let currentEventStyle = eventStyle;
    let currentStyleStatus = styleStatus;
    let currentIconTimeline = iconTimeline;
    let currentEventStatus = eventStatus;
    let displayIconStatus = iconStatus;
    if (waitingDay) {
      displayTimeout = `${waitingDay} day, ${waitingHr} hr, ${waitingMn} min`;
    } else if (remainTimeHr < 1 && remainTimeMn > 0) {
      displayTimeout = (
        <CountDownDisplay startTime={remainTimeMn} serviceName={serviceName} providerName={providerName} />
      );
      currentEventStyle = { background: 'rgb(255, 95, 87)', color: '#fff' };
      currentStyleStatus = styles.eventStatusCountDown;
      currentIconTimeline = <Update />;
      currentEventStatus = STATUS.COMING;
      displayIconStatus = <Timer className="icon-danger" />;
    } else {
      displayTimeout = `${waitingHr} hr, ${waitingMn} min`;
    }
    const mapProvider = { geoLocation };

    return (
      <>
        {isOpenMap && (
          <MapDialog
            toggle={this.handleToggleMap}
            isOpen={isOpenMap}
            serviceName={serviceName}
            provider={mapProvider}
          />)
        }
        <VerticalTimelineElement
          iconStyle={currentEventStyle}
          icon={currentIconTimeline}
          className={styles.cardContainer}
        >
          <div>
            <Typography variant="h6" color="primary" noWrap align="center">
              {streetAddress}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" color="textSecondary" align="center">
              {district} {state} {postCode} - {city} {country}
            </Typography>
          </div>
          {currentEventStatus === STATUS.EXPIRED && (
            <div className={styles.ratingWrapper}>
              <div className={styles.ratingInner}>
                <Typography variant="subheading" classes={{ subheading: styles.ratingText }}>
                  {providerRating === 0 ? 'Rate our provider quality.' : 'Thank you for choosing us!'}
                </Typography>
                <div className={styles.appointmentRemainedTime}>
                  <Rating
                    value={providerRating}
                    readOnly={!!providerRating}
                    onChange={this.handleCustomerRating(customerId, serviceProviderId)}
                    classes={{ iconButton: styles.ratingIcon }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles.appointmentCode}>
            <Typography variant="headline" color="secondary" align="center" classes={{ headline: styles.bookingCode }}>
              {bookingCode}
            </Typography>
          </div>
          <div>
            <div className={styles.serviceTitleMap}>
              <Typography variant="title" color="textSecondary" noWrap>{serviceName}</Typography>
              <IconButton className="button-sm simple-button" onClick={this.handleToggleMap}>
                <PersonPin className="icon-main icon-shake icon-small danger-color" />
                <Typography variant="caption" color="inherit" className="danger-color">View map</Typography>
              </IconButton>
            </div>
            <div className={styles.providerRating}>
              <Typography
                variant="subheading"
                color="textSecondary"
                className="text-bold icon-main"
              >{providerName}
              </Typography>
              <RateStar rating={providerRating} />
            </div>
            <div className={styles.appointmentItem}>
              <DateRange className="icon-main" />
              <Typography variant="subheading" color="primary" inline noWrap>
                {moment(startSec * 1000).format('DD MMM YYYY')}
              </Typography>
            </div>
            <div className={styles.appointmentItem}>
              <Schedule className="icon-main" />
              <Typography variant="subheading" color="primary" inline noWrap>
                {moment(startSec * 1000).format('LT')}{' - '}{moment(toSecCalc).format('LT')}
              </Typography>
            </div>
          </div>
          <div className={styles.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">{currentEventStatus}</Typography>
          </div>
          <div className={`${styles.appointmentRemainedTime} ${currentStyleStatus}`}>
            <AlarmOn className="icon-white" />
            <Typography variant="subheading" classes={{ subheading: styles.remainedText }}>
              {displayTimeout}
            </Typography>
          </div>
        </VerticalTimelineElement>
      </>
    );
  }
}

TimelineCard.propTypes = {
  serviceName: string.isRequired,
  providerName: string.isRequired,
  slot: shape({
    startSec: number.isRequired,
    toSec: number,
    providerId: string,
    serviceId: string,
  }).isRequired,
  duration: number.isRequired,
  geoLocation: objectOf(any).isRequired,
  rateAppointmentAction: func.isRequired,
  bookingCode: string.isRequired,
  customerId: string.isRequired,
  providerList: arrayOf(any).isRequired,
};

const mapStateToProps = state => ({
  providerList: state.home.providerList,
});

export default connect(mapStateToProps, {
  rateAppointmentAction: setRatingService,
})(TimelineCard);
