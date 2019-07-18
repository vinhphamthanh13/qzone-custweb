import React, { Component } from 'react';
import {
  string,
  number,
  objectOf,
  any,
  func,
  bool,
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
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import { cancelEventByIdAction } from 'actionsReducers/profile.actions';
import Rating from 'material-ui-rating';
import CustomModal from 'components/Modal/CustomModal';
import s from './TimelineCard.module.scss';
import CountDownDisplay from './CountDownDisplay';
import { STATUS } from './Appointment.constants';

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
  };

  static defaultProps = {
    cancellable: true,
  };

  static getDerivedStateFromProps(props, state) {
    const {
      serviceProviders,
    } = props;
    const {
      serviceProviders: cachedServiceProviders,
    } = state;
    if (serviceProviders !== cachedServiceProviders) {
      return {
        serviceProviders,
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
    this.handleCancelEventConfirmation(false)();
    this.setState({
      eventId: null,
    });
    cancelEventById(eventId);
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
      id,
      status,
      cancellable,
    } = this.props;
    const {
      isOpenMap,
      isCancelEvent,
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
        STATUS.EXPIRED,
        <AssignmentLate className="icon-main danger-color" />,
        s.eventStatusComplete,
        <NotInterested className="icon-white" />,
      ] : [
        {
          background: 'rgb(87, 201, 249)',
          color: '#fff',
        },
        <AlarmOn />,
        STATUS.WAITING,
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
      displayTimeout = status === STATUS.UNSPECIFIED ? (
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
      currentEventStatus = STATUS.COMING;
      displayIconStatus = <Timer className="icon-danger" />;
    }
    const streetAddress = get(geoLocation, 'streetAddress');
    const district = get(geoLocation, 'district');
    const state = get(geoLocation, 'state');
    const postCode = get(geoLocation, 'postCode');
    const city = get(geoLocation, 'city');
    const country = get(geoLocation, 'country');
    const mapProvider = { geoLocation };
    const eventExpired = eventStatus === STATUS.EXPIRED;
    const statusStyle = status === STATUS.CANCELED ? 'bg-danger' : 'bg-success';

    return (
      <>
        <CustomModal
          message={`Are your sure to cancel this event? Code ${bookingCode.toUpperCase()}`}
          title="Event Confirmation"
          isOpen={isCancelEvent}
          type="info"
          cancelCallBack={this.handleCancelEventConfirmation(false)}
          okCallBack={this.handleCancelEventAction}
        />
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
          <div>
            <Typography variant="headline" color="inherit" className="text-bold" noWrap align="center">
              {streetAddress}
            </Typography>
          </div>
          <div className={s.eventFullAddress}>
            <Typography variant="subtitle1" color="textSecondary" align="center">
              {district} {state} {postCode} - {city} {country}
            </Typography>
            {!eventExpired && (
              <Button color="inherit" className="simple-button" onClick={this.handleToggleMap}>
                <LocationOn color="inherit" className="icon-main" />
                View map
              </Button>)}
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
            <Typography variant="headline" color="secondary" align="center" classes={{ headline: s.bookingCode }}>
              {bookingCode.toUpperCase()}
            </Typography>
          </div>
          <div className={s.cardDetail}>
            <div className={s.serviceTitleMap}>
              <Typography variant="title" color="inherit" className="text-bold" noWrap>{serviceName}</Typography>
            </div>
            <div className={s.providerRating}>
              <Typography
                variant="subheading"
                color="textSecondary"
                className="text-bold icon-main"
              >{providerName}
              </Typography>
              <RateStar rating={providerRating} />
            </div>
            <div className={s.appointmentItem}>
              <DateRange className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format('DD MMM YYYY')}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <AvTimer className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {moment(providerStartSec).format('LT')}{' - '}{moment(providerStartSec).add(duration, 'm').format('LT')}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <Public className="icon-main" />
              <Typography variant="subheading" color="inherit" inline noWrap>
                {timezone}
              </Typography>
            </div>
          </div>
          <div className={s.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">{currentEventStatus}</Typography>
          </div>
          <div className={`${s.appointmentRemainedTime} ${currentStyleStatus}`}>
            <div className={s.remainedDisplay}>
              {countDownPreIcon}
              <Typography variant="subheading" classes={{ subheading: s.remainedText }}>
                {displayTimeout}
              </Typography>
            </div>
            {status === STATUS.UNSPECIFIED ? (
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
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  setRatingService,
  cancelEventByIdAction,
})(TimelineCard);
