import React, { Component } from 'react';
import {
  string,
  number,
  objectOf,
  any,
  func,
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
  PersonPin,
  Public,
  Cancel,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import Rating from 'material-ui-rating';
import s from './TimelineCard.module.scss';
import CountDownDisplay from './CountDownDisplay';
import { STATUS } from './Appointment.constants';

class TimelineCard extends Component {
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
    };
  }

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
      bookingCode,
      customerId,
      duration,
      providerStartSec,
      providerName,
      serviceName,
      timezone,
      geoLocation,
    } = this.props;
    const {
      isOpenMap,
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
      displayTimeout = (
        <CountDownDisplay startTime={remainTimeSec} serviceName={serviceName} providerName={providerName} />
      );
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
          className={s.cardContainer}
        >
          <div>
            <Typography variant="headline" color="inherit" className="text-bold" noWrap align="center">
              {streetAddress}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle1" color="textSecondary" align="center">
              {district} {state} {postCode} - {city} {country}
            </Typography>
          </div>
          {currentEventStatus === eventExpired && (
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
              <Button color="inherit" className="simple-button" onClick={this.handleToggleMap}>
                <PersonPin color="inherit" className="icon-main icon-normal" />
                View map
              </Button>
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
            {countDownPreIcon}
            <Typography variant="subheading" classes={{ subheading: s.remainedText }}>
              {displayTimeout}
            </Typography>
          </div>
          <div className={s.cardCta}>
            <Button
              color="inherit"
              variant="outlined"
              className="secondary-button"
              disabled={eventExpired}
            >
              <Cancel color="inherit" className="icon-in-button-left" />
              Cancel
            </Button>
          </div>
        </VerticalTimelineElement>
      </>
    );
  }
}

TimelineCard.propTypes = {
  serviceName: string.isRequired,
  providerName: string.isRequired,
  providerStartSec: string.isRequired,
  timezone: string.isRequired,
  duration: number.isRequired,
  geoLocation: objectOf(any).isRequired,
  rateAppointmentAction: func.isRequired,
  bookingCode: string.isRequired,
  customerId: string.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  rateAppointmentAction: setRatingService,
})(TimelineCard);
