import React, { Component } from 'react';
import {
  string, number, objectOf, any, func, bool, arrayOf, object,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import {
  Typography,
  Button,
} from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange,
  AvTimer,
  AlarmOff,
  AlarmOn,
  Reorder,
  AlarmAdd,
  NotInterested,
  AssignmentLate,
  Update,
  Timer,
  LocationOn,
  Public,
  Cancel,
  Email,
  Call,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import { cancelEventByIdAction } from 'actionsReducers/profile.actions';
import Rating from 'material-ui-rating';
import CustomModal from 'components/Modal/CustomModal';
import Success from 'components/Success';
import Error from 'components/Error';
import { longDateFormat } from 'utils/constants';
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
    timezone: string.isRequired,
    duration: number.isRequired,
    geoLocation: objectOf(any).isRequired,
    setRatingService: func.isRequired,
    bookingCode: string.isRequired,
    customerId: string.isRequired,
    cancelEventByIdAction: func.isRequired,
    status: string.isRequired,
    cancellable: bool,
    providerEmail: string.isRequired,
    providerTelephone: string,
    tempServiceId: string.isRequired,
    availabilitiesBulk: arrayOf(object).isRequired,
  };

  static defaultProps = {
    cancellable: true,
    providerTelephone: '',
  };

  static getDerivedStateFromProps(props, state) {
    const {
      serviceProviders,
      viewUrl,
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
    const { eventId } = this.state;
    this.handleCancelEventConfirmation(false, null)();
    cancelEventById(eventId);
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  handleRescheduleEventConfirmation = (value, eventId, specialServiceId) => () => {
    this.setState({
      isRescheduleOpen: value,
      specialServiceId,
      eventId,
    });
  };

  handleRescheduleEventAction = () => {
    this.handleRescheduleEventConfirmation(false, null)();
  };

  handleShowRescheduleSlots = specialServiceId => () => {
    this.setState({
      specialServiceId,
    });
  };

  render() {
    const {
      bookingCode,
      customerId,
      duration,
      providerStartSec,
      providerName,
      serviceName,
      timezone,
      geoLocation,
      providerEmail,
      providerTelephone,
      id,
      status,
      cancellable,
      tempServiceId,
      availabilitiesBulk,
    } = this.props;
    const {
      isOpenMap,
      isCancelEvent,
      viewUrl,
      isRescheduleOpen,
      specialServiceId,
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

    let displayTimeout = 'Slot is not valid anymore!';
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
    const fullAddress = get(geoLocation, 'fullAddress');
    const mapProvider = { geoLocation };
    const eventExpired = eventStatus === EVENT_STATUS.EXPIRED;
    const statusStyle = status === EVENT_STATUS.CANCELED ? 'bg-danger' : 'bg-success';
    const isReschedule = status !== EVENT_STATUS.CANCELED && status !== EVENT_STATUS.COMPLETED;

    return (
      <>
        {viewUrl && (
          <>
            <Success userCallback={this.handleRefreshPage} />
            <Error />
          </>
        )}
        <CustomModal
          message={`Are your sure to reschedule this event? Code ${bookingCode.toUpperCase()}`}
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
        {specialServiceId && availabilitiesBulk && availabilitiesBulk.length > 0
        && (
          <RescheduleSlots
            rescheduledSlots={availabilitiesBulk.filter(slot => slot.specialServiceId === tempServiceId)}
            onRescheduleConfirm={this.handleRescheduleEventConfirmation}
          />
        )}
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
                {timezone}
              </Typography>
            </div>
          </div>
          <div className={s.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">
              {currentEventStatus}
            </Typography>
            {isReschedule && (
              <Button
                color="inherit"
                variant="text"
                className={`${s.reschedule} simple-button`}
                onClick={this.handleShowRescheduleSlots(tempServiceId)}
              >
                <Update color="inherit" className="icon-in-button-left" />
                Reschedule
              </Button>
            )}
          </div>
          <div className={`${s.appointmentRemainedTime} ${currentStyleStatus}`}>
            <div className={s.remainedDisplay}>
              {countDownPreIcon}
              <Typography variant="subheading" classes={{ subheading: s.remainedText }}>
                {displayTimeout}
              </Typography>
            </div>
            {status === EVENT_STATUS.UNSPECIFIED ? (
              <>
                {cancellable && (
                  <Button
                    color="inherit"
                    variant="outlined"
                    className={!eventExpired ? s.cancelEvent : s.cancelEventHidden}
                    onClick={this.handleCancelEventConfirmation(true, id)}
                    disabled={eventExpired}
                  >
                    <Cancel color="inherit" className="icon-in-button-left" />
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              <Typography
                variant="subheading"
                className={`${statusStyle} ${s.eventStatus} text-bold`}
              >
                {status}
              </Typography>
            )}
            {}
          </div>
        </VerticalTimelineElement>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.booking,
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  setRatingService,
  cancelEventByIdAction,
})(TimelineCard);
