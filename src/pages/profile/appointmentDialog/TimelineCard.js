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
  IconButton,
  Typography,
} from '@material-ui/core';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange,
  AvTimer,
  AlarmOff,
  AlarmOn,
  Reorder,
  AlarmAdd,
  DoneAll,
  Update,
  Timer,
  PersonPin,
  Public,
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
    const endTimeSec = bookedTime.add(duration, 'm').unix() * 1000;
    const currentSec = moment().unix() * 1000;
    const remainTimeSec = currentSec - endTimeSec;
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
        <Reorder className="icon-main" />,
        s.eventStatusWaiting,
      ];

    let displayTimeout = null;
    let currentEventStyle = eventStyle;
    let currentStyleStatus = styleStatus;
    let currentIconTimeline = iconTimeline;
    let currentEventStatus = eventStatus;
    let displayIconStatus = iconStatus;
    console.log('remainTimeSec', remainTimeSec);
    if (remainTimeSec < -3600) {
      displayTimeout = moment(bookedTime).fromNow(true);
    } else {
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
          {currentEventStatus === STATUS.EXPIRED && (
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
              {bookingCode}
            </Typography>
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
            <AlarmAdd className="icon-white" />
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
