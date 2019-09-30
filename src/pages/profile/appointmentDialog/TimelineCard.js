import React, { Component } from 'react';
import { string, number, objectOf, func, arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import { Typography, Button } from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import { DateRange, AvTimer, AlarmOff, AlarmOn, Reorder, AlarmAdd, NotInterested, AssignmentLate, Update, Timer,
  LocationOn, Public, Email, Call,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService, rescheduleEvent, setRescheduleStatusAction } from 'actionsReducers/common.actions';
import { cancelEventByIdAction } from 'actionsReducers/profile.actions';
import Rating from 'material-ui-rating';
import CustomModal from 'components/Modal/CustomModal';
import Success from 'components/Success';
import Error from 'components/Error';
import { longDateFormat, timeSlotFormat } from 'utils/constants';
import { navigateTo } from 'utils/common';
import { EVENT_STATUS } from './Appointment.constants';
import RescheduleSlots from '../RescheduleSlots';
import s from './TimelineCard.module.scss';
import CountDownDisplay from './CountDownDisplay';

class TimelineCard extends Component {
  static propTypes = {
    id: string.isRequired,
    serviceName: string.isRequired,
    providerName: string.isRequired,
    providerStartSec: string.isRequired,
    timezoneId: string.isRequired,
    duration: number.isRequired,
    coordinates: objectOf(number).isRequired,
    setRatingService: func.isRequired,
    bookingCode: string.isRequired,
    customerId: string.isRequired,
    cancelEventByIdAction: func.isRequired,
    status: string.isRequired,
    providerEmail: string.isRequired,
    providerTelephone: string,
    tempServiceId: string.isRequired,
    availabilitiesBulk: arrayOf(object).isRequired,
    rescheduleEvent: func.isRequired,
    setRescheduleStatusAction: func.isRequired,
    fullAddress: string.isRequired,
  };

  static defaultProps = {
    providerTelephone: '',
  };

  static getDerivedStateFromProps(props, state) {
    const {
      serviceProviders,
      viewUrl,
      loginSession,
    } = props;
    const {
      serviceProviders: cachedServiceProviders,
      viewUrl: cachedViewUrl,
    } = state;
    if (
      serviceProviders !== cachedServiceProviders
      || viewUrl !== cachedViewUrl
    ) {
      return {
        serviceProviders,
        viewUrl,
        loginSession,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpenMap: false,
      isCancelEvent: false,
      eventId: null,
      isRescheduleOpen: false,
      specialServiceId: null,
      loginSession: null,
    };
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

  handleCancelEventConfirmation = (value, eventId) => () => {
    this.setState({
      isCancelEvent: value,
      eventId,
    });
  };

  handleCancelEventAction = () => {
    const { cancelEventByIdAction: cancelEventById } = this.props;
    const { eventId, loginSession } = this.state;
    const authHeaders = get(loginSession, 'authHeaders');
    this.handleCancelEventConfirmation(false, null)();
    cancelEventById(eventId, authHeaders);
  };

  handleRescheduleEventConfirmation = (value, eventId) => (data) => {
    const availabilityId = get(data, 'availabilityId');
    const startTime = get(data, 'start');
    this.setState({
      isRescheduleOpen: value,
      newAvailabilityId: availabilityId || null,
      eventId,
      rescheduledTime: moment(startTime * 1000).format(timeSlotFormat).toUpperCase(),
      specialServiceId: null,
    });
  };

  handleRescheduleEventAction = () => {
    const { rescheduleEvent: rescheduleEventAction, setRescheduleStatusAction: setRescheduleStatus } = this.props;
    const { eventId, newAvailabilityId, loginSession } = this.state;
    const authHeaders = get(loginSession, 'authHeaders');
    this.handleRescheduleEventConfirmation(false, null, null)();
    rescheduleEventAction({ eventId, newAvailabilityId }, authHeaders);
    setRescheduleStatus(500);
  };

  handleShowRescheduleSlots = specialServiceId => () => {
    this.setState({
      specialServiceId,
    });
  };

  handleRedirectEvent = eventId => () => {
    navigateTo(`/event/${eventId}`)();
  };

  render() {
    const {
      bookingCode,
      customerId,
      duration,
      providerStartSec,
      providerName,
      serviceName,
      timezoneId,
      coordinates,
      providerEmail,
      providerTelephone,
      id,
      status,
      tempServiceId,
      availabilitiesBulk,
      fullAddress,
    } = this.props;
    const {
      isOpenMap,
      isCancelEvent,
      viewUrl,
      isRescheduleOpen,
      specialServiceId,
      rescheduledTime,
    } = this.state;

    const serviceProviderId = '//TODO';
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
        <AssignmentLate className="icon-main danger-color" />,
        s.eventStatusComplete,
        <NotInterested className="icon-white" />,
      ] : [
        {
          background: 'rgb(87, 201, 249)',
          color: '#fff',
        },
        <AlarmOn />,
        EVENT_STATUS.WAITING,
        <Reorder className="icon-main" />,
        s.eventStatusWaiting,
        <AlarmAdd className="icon-white" />,
      ];

    let displayTimeout = 'Slot is invalid!';
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
    const mapProvider = { coordinates, fullAddress };
    const eventExpired = eventStatus === EVENT_STATUS.EXPIRED;
    const statusStyle = status === EVENT_STATUS.CANCELED ? 'bg-danger' : 'bg-success';

    return (
      <>
        {viewUrl && (
          <>
            <Success userCallback={navigateTo('/')} />
            <Error />
          </>
        )}
        <CustomModal
          message={`Are your sure to reschedule this event to ${rescheduledTime} for booking code \
          ${bookingCode.toUpperCase()}`}
          title="Event Confirmation"
          isOpen={isRescheduleOpen}
          type="info"
          cancelCallBack={this.handleRescheduleEventConfirmation(false, null, null)}
          okCallBack={this.handleRescheduleEventAction}
        />
        <CustomModal
          message={`Are your sure to cancel this event? Code ${bookingCode.toUpperCase()}`}
          title="Event Confirmation"
          isOpen={isCancelEvent}
          type="info"
          cancelCallBack={this.handleCancelEventConfirmation(false)}
          okCallBack={this.handleCancelEventAction}
        />
        {specialServiceId && (
          <RescheduleSlots
            rescheduledSlots={availabilitiesBulk.filter(slot => slot.specialServiceId === tempServiceId)}
            onRescheduleConfirm={this.handleRescheduleEventConfirmation(true, id)}
            closeReschedule={this.handleRescheduleEventConfirmation(false, null)}
          />
        )}
        {isOpenMap && (
          <MapDialog
            toggle={this.handleToggleMap}
            isOpen={isOpenMap}
            serviceName={serviceName}
            geoLocation={mapProvider}
          />)
        }
        <VerticalTimelineElement
          iconStyle={currentEventStyle}
          icon={currentIconTimeline}
          className={s.cardContainer}
        >
          <div className="flexCol v-center h-center">
            <Typography variant="subtitle1" color="inherit" className="text-bold text-center">
              {fullAddress}
            </Typography>
            {!eventExpired && (
              <Button color="inherit" className="simple-button" onClick={this.handleToggleMap}>
                <LocationOn color="inherit" className="icon-main" />
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
                    readOnly={!!providerRating || !serviceProviderId}
                    onChange={this.handleCustomerRating(customerId, serviceProviderId)}
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
            <div className={s.serviceTitleMap}>
              <Typography variant="title" color="inherit" className="text-bold" noWrap>{serviceName}</Typography>
            </div>
            <div className={s.providerRating}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                className="text-bold icon-main"
              >{providerName}
              </Typography>
              <RateStar rating={providerRating} />
            </div>
            <div className={s.appointmentItem}>
              <DateRange className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format(longDateFormat)}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <AvTimer className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format('LT')}{' - '}{moment(providerStartSec).add(duration, 'm').format('LT')}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <Email className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {providerEmail}
              </Typography>
            </div>
            {providerTelephone !== null && providerTelephone.length > 0 && (
              <div className={s.appointmentItem}>
                <Call className="icon-main" />
                <Typography variant="subheading" color="inherit" inline noWrap>
                  {providerTelephone}
                </Typography>
              </div>
            )}
            <div className={s.appointmentItem}>
              <Public className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {timezoneId}
              </Typography>
            </div>
          </div>
          <div className={s.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">
              {currentEventStatus}
            </Typography>
          </div>
          <div className={`${s.appointmentRemainedTime} ${currentStyleStatus}`}>
            <div className={s.remainedDisplay}>
              {countDownPreIcon}
              <Typography variant="subheading" classes={{ subheading: s.remainedText }}>
                {displayTimeout}
              </Typography>
            </div>
            <Typography
              variant="subheading"
              className={`${statusStyle} ${s.eventStatus} text-bold`}
            >
              {status}
            </Typography>
          </div>
          {status !== EVENT_STATUS.CANCELED && !eventExpired && (
            <div className={s.learnMorePolicy}>
              <Typography onClick={this.handleRedirectEvent(id)}  className="text-bold hover-pointer info-color">
                Cancel or reschedule this event?
              </Typography>
            </div>
          )

          }
        </VerticalTimelineElement>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.home,
  ...state.booking,
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  setRatingService,
  cancelEventByIdAction,
  rescheduleEvent,
  setRescheduleStatusAction,
})(TimelineCard);
