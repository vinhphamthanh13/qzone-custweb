import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { get } from 'lodash';
import { Typography, Button } from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import { DateRange, Schedule, AlarmOff, AlarmOn, Reorder, AlarmAdd, NotInterested, AssignmentLate, Update, Timer,
  Map, GpsFixed, Email, PhoneIphone,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import Rating from 'material-ui-rating';
import { FULL_DATE, EVENT_STATUS, TIME_FORMAT, DEFAULT_TIME } from 'utils/constants';
import { navigateTo } from 'utils/common';
import CountDownDisplay from './CountDownDisplay';
import s from './TimelineCard.module.scss';

class TimelineCard extends Component {
  static propTypes = {
    setRatingService: func.isRequired,
  };

  state = { isOpenMap: false };

  static getDerivedStateFromProps(props, state) {
    const { eventById } = props;
    const { eventById: cachedEventById } = state;
    const updatedState = {};
    if (
      eventById !== null &&
      JSON.stringify(eventById) !== JSON.stringify(cachedEventById)
    ) {
      updatedState.eventById = eventById;
    }

    return Object.keys(updatedState) ? updatedState : null;

  }

  handleCustomerRating = (customerId, serviceProviderId) => (rating) => {
    const { setRatingService: rateAppointmentAction } = this.props;
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

  handleRedirectEvent = eventId => () => {
    navigateTo(`/event/${eventId}`)();
  };

  render() {
    const { eventById, isOpenMap } = this.state;
    const bookingCode = get(eventById, 'bookingCode');
    const customerId = get(eventById, 'customerId');
    const duration = get(eventById, 'duration');
    const providerStartSec = get(eventById, 'providerStartSec') || DEFAULT_TIME;
    const providerName = get(eventById, 'providerName');
    const serviceName = get(eventById, 'serviceName');
    const timezoneId = get(eventById, 'timezoneId');
    const coordinates = get(eventById, 'coordinates');
    const providerEmail = get(eventById, 'providerEmail');
    const providerTelephone = get(eventById, 'providerTelephone');
    const id = get(eventById, 'id');
    const temporaryServiceId = get(eventById, 'temporaryServiceId');
    const status = get(eventById, 'status');
    const fullAddress = get(eventById, 'fullAddress');
    const providerRating = 5;
    const bookedTime = moment(providerStartSec.replace(' ', 'T'));
    const currentSec = moment().unix() * 1000;
    const remainTimeSec = currentSec - bookedTime;
    const [eventStyle, iconTimeline, eventStatus, iconStatus, styleStatus, countDownPreIcon] = remainTimeSec > 0
      ? [
        {
          background: 'rgb(61, 63, 66)',
          color: '#fff',
        },
        <AlarmOff />,
        EVENT_STATUS.EXPIRED,
        <AssignmentLate className="icon-small danger-color" />,
        s.eventStatusComplete,
        <NotInterested className="icon-white" />,
      ] : [
        {
          background: 'rgb(87, 201, 249)',
          color: '#fff',
        },
        <AlarmOn />,
        EVENT_STATUS.WAITING,
        <Reorder className="icon-small" />,
        s.eventStatusWaiting,
        <AlarmAdd className="icon-white" />,
      ];

    let displayTimeout = 'Event is invalid!';
    let currentEventStyle = eventStyle;
    let currentStyleStatus = styleStatus;
    let currentIconTimeline = iconTimeline;
    let currentEventStatus = eventStatus;
    let displayIconStatus = iconStatus;

    if (remainTimeSec < -3600000) {
      displayTimeout = moment(bookedTime).fromNow(true);
    } else if (remainTimeSec > -36000000 && remainTimeSec < 0) {
      displayTimeout = status === EVENT_STATUS.UNSPECIFIED ? (
        <CountDownDisplay startTime={remainTimeSec} serviceName={serviceName} providerName={providerName} />
      ) : displayTimeout;
      currentEventStyle = {
        background: 'rgb(255, 95, 87)',
        color: '#fff',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        animationName: 'shaking-up-down',
        animationDuration: '6s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in',
      };
      currentStyleStatus = s.eventStatusCountDown;
      currentIconTimeline = <Update />;
      currentEventStatus = EVENT_STATUS.COMING;
      displayIconStatus = <Timer className="icon-danger" />;
    }

    if (status === EVENT_STATUS.CANCELED) currentEventStatus = `${EVENT_STATUS.CANCELED} CONFIRMED!`;
    const geoLocation = { coordinates, fullAddress };
    const eventExpired = eventStatus === EVENT_STATUS.EXPIRED;
    const statusStyle = status === EVENT_STATUS.CANCELED ? 'bg-danger' : 'bg-success';

    return (
      <>
        <MapDialog
          toggle={this.handleToggleMap}
          isOpen={isOpenMap}
          serviceName={serviceName}
          geoLocation={geoLocation}
        />
        <VerticalTimelineElement iconStyle={currentEventStyle} icon={currentIconTimeline} className={s.cardContainer}>
          <div className="flexCol v-center h-center">
            <Typography variant="subtitle1" color="inherit" className="text-bold text-center">
              {fullAddress}
            </Typography>
            {!eventExpired && (
              <Button color="inherit" className="simple-button" onClick={this.handleToggleMap}>
                <Map color="inherit" className="icon-small" />
                View map
              </Button>
            )}
          </div>
          {eventExpired && (
            <div className={s.ratingWrapper}>
              <div className={s.ratingInner}>
                <Typography variant="subheading" classes={{ subheading: s.ratingText }}>
                  {providerRating === 0 ? 'Rate our provider quality.' : 'Thank you for choosing us!'}
                </Typography>
                <div className={s.appointmentRemainedTime}>
                  <Rating
                    value={providerRating}
                    readOnly={!!providerRating || !temporaryServiceId}
                    onChange={this.handleCustomerRating(customerId, temporaryServiceId)}
                    classes={{ iconButton: s.ratingIcon }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={s.appointmentCode}>
            <Typography variant="headline" color="secondary" classes={{ headline: s.bookingCode }}>
              {bookingCode.toUpperCase()}
            </Typography>
          </div>
          <div className={s.cardDetail}>
            <div className={s.sName}>
              {serviceName}
            </div>
            <div className={s.providerRating}>
              <Typography variant="subtitle1" className="text-bold text-capitalize" noWrap>
                {providerName}
              </Typography>
              <div className={s.rateStars}>
                <RateStar rating={providerRating} size="small" />
              </div>
            </div>
            <div className={s.appointmentItem}>
              <DateRange className="icon-small" color="secondary" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format(FULL_DATE)}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <Schedule className="icon-small" color="secondary"/>
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format(TIME_FORMAT)}{' - '}
                {moment(providerStartSec).add(duration, 'm').format(TIME_FORMAT)}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <Email className="icon-small" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {providerEmail}
              </Typography>
            </div>
            {providerTelephone !== null && providerTelephone.length > 0 && (
              <div className={s.appointmentItem}>
                <PhoneIphone className="icon-small" />
                <Typography variant="subheading" color="inherit" inline noWrap>{providerTelephone}</Typography>
              </div>
            )}
            <div className={s.appointmentItem}>
              <GpsFixed className="icon-small" />
              <Typography variant="subheading" color="inherit" inline noWrap>{timezoneId}</Typography>
            </div>
          </div>
          <div className={s.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">{currentEventStatus}</Typography>
          </div>
          <div className={`${s.appointmentRemainedTime} ${currentStyleStatus}`}>
            <div className={s.remainedDisplay}>
              {countDownPreIcon}
              <Typography variant="subheading" classes={{ subheading: s.remainedText }}>{displayTimeout}</Typography>
            </div>
            <Typography variant="subheading" className={`${statusStyle} ${s.eventStatus} text-bold`}>
              {status}
            </Typography>
          </div>
          {status !== EVENT_STATUS.CANCELED && !eventExpired && (
            <div className={s.learnMorePolicy}>
              <Typography onClick={this.handleRedirectEvent(id)}  className="text-bold hover-pointer info-color">
                Cancel or reschedule this event?
              </Typography>
            </div>
          )}
        </VerticalTimelineElement>
      </>
    );
  }
}

export default connect(null, { setRatingService })(TimelineCard);
