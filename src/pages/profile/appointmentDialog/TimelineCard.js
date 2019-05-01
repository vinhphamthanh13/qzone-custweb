import React, { Component } from 'react';
import {
  shape,
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
  IconButton,
  Typography,
  Button,
} from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange,
  Schedule,
  AlarmOff,
  AlarmOn,
  AirlineSeatReclineNormal,
  DoneAll,
  Update,
  Timer,
  PersonPin,
} from '@material-ui/icons';
import RateStar from 'components/Rating/RateStar';
import MapDialog from 'components/Map/MapDialog';
import { setRatingService } from 'actionsReducers/common.actions';
import {
  registerWaitListAction,
} from 'actionsReducers/waitlist.actions';
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
      serviceProviders: null,
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

  handleRegisterWaitList = () => {
    const { registerWaitListAction: registerWaitList } = this.props;
    registerWaitList();
  };

  render() {
    const {
      serviceName,
      providerName,
      slot: {
        startSec, toSec, providerId, serviceId,
      },
      duration,
      geoLocation: {
        city, country,
        district, postCode, state,
        streetAddress,
      },
      bookingCode,
      customerId,
      geoLocation,
    } = this.props;
    const {
      isOpenMap,
      serviceProviders,
    } = this.state;
    const toSecCalc = (toSec || startSec + duration * 60) * 1000;
    const current = new Date();
    const currentSec = current.getTime() / 1000;
    const remainTimeSec = currentSec - (+startSec);
    const [eventStyle, iconTimeline, eventStatus, iconStatus, styleStatus] = remainTimeSec > 0
      ? [
        {
          background: 'rgb(61, 63, 66)',
          color: '#fff',
        },
        <AlarmOff />,
        STATUS.EXPIRED,
        <DoneAll className="icon-main danger-color" />,
        s.eventStatusComplete,
      ] : [
        {
          background: 'rgb(87, 201, 249)',
          color: '#fff',
        },
        <AlarmOn />,
        STATUS.WAITING,
        <AirlineSeatReclineNormal className="icon-main" />,
        s.eventStatusWaiting,
      ];

    const remainTimeHr = remainTimeSec < 0 ? Math.abs(remainTimeSec) / 3600 : 0;
    const remainDay = remainTimeHr > 24 ? remainTimeHr / 24 : 0;
    const remainTimeMn = (remainTimeHr % 1) * 60;
    const waitingDay = parseInt(remainDay, 0);
    const waitingHr = waitingDay ? parseInt((remainDay % 1) * 24, 0) : parseInt(remainTimeHr, 0);
    const waitingMn = parseInt(remainTimeMn, 0);
    const serviceProvider = serviceProviders
      .filter(item => item.providerId === providerId && item.serviceId === serviceId);
    console.log('serviceProvider', serviceProviders);
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
          className={s.cardContainer}
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
            <div className={s.ratingWrapper}>
              <div className={s.ratingInner}>
                <Typography variant="subheading" classes={{ subheading: s.ratingText }}>
                  {providerRating === 0 ? 'Rate our provider quality.' : 'Thank you for choosing us!'}
                </Typography>
                <div className={s.appointmentRemainedTime}>
                  <Rating
                    value={providerRating}
                    readOnly={!!providerRating}
                    onChange={this.handleCustomerRating(customerId, serviceProviderId)}
                    classes={{ iconButton: s.ratingIcon }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={s.appointmentCode}>
            <Typography variant="headline" color="secondary" align="center" classes={{ headline: s.bookingCode }}>
              {bookingCode}
            </Typography>
            <div className={s.registerWaitList}>
              <Button className="simple-button" variant="outlined">
                join queue!
              </Button>
            </div>
          </div>
          <div>
            <div className={s.serviceTitleMap}>
              <Typography variant="title" color="textSecondary" noWrap>{serviceName}</Typography>
              <IconButton className="button-sm simple-button" onClick={this.handleToggleMap}>
                <PersonPin className="icon-main icon-shake icon-small danger-color" />
                <Typography variant="caption" color="inherit" className="danger-color">View map</Typography>
              </IconButton>
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
              <Typography variant="subheading" color="primary" inline noWrap>
                {moment(startSec * 1000).format('DD MMM YYYY')}
              </Typography>
            </div>
            <div className={s.appointmentItem}>
              <Schedule className="icon-main" />
              <Typography variant="subheading" color="primary" inline noWrap>
                {moment(startSec * 1000).format('LT')}{' - '}{moment(toSecCalc).format('LT')}
              </Typography>
            </div>
          </div>
          <div className={s.appointmentItem}>
            {displayIconStatus}
            <Typography variant="subheading" className="danger-color">{currentEventStatus}</Typography>
          </div>
          <div className={`${s.appointmentRemainedTime} ${currentStyleStatus}`}>
            <AlarmOn className="icon-white" />
            <Typography variant="subheading" classes={{ subheading: s.remainedText }}>
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
  registerWaitListAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.waitlists,
});

export default connect(mapStateToProps, {
  rateAppointmentAction: setRatingService,
  registerWaitListAction,
})(TimelineCard);
