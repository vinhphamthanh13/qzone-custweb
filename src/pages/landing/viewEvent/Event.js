import React, { Component } from 'react';
import { func } from 'prop-types';
import { DateRange, Email, GpsFixed, HowToReg, Map, PhoneIphone, Place, Schedule } from '@material-ui/icons';
import { get } from 'lodash';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import { FULL_DATE, TIME_FORMAT, EVENT_STATUS } from 'utils/constants';
import s from './Event.module.scss';

class Event extends Component {
  static propTypes = {
    viewMap: func.isRequired,
  };

  state = {
    appointment: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { appointment } = props;
    const { appointment: cachedAppointment } = state;
    const updatedState = {};
    if (
      appointment !== null &&
      JSON.stringify(appointment) !== JSON.stringify(cachedAppointment)
    ) {
      updatedState.appointment = appointment;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { viewMap } = this.props;
    const { appointment } = this.state;
    const fullAddress = get(appointment, 'fullAddress');
    const sName = get(appointment, 'serviceName', '');
    const pName = get(appointment, 'providerName');
    const pEmail = get(appointment, 'providerEmail');
    const providerStartSec = get(appointment, 'providerStartSec', '');
    const duration = get(appointment, 'duration');
    const pPhone = get(appointment, 'providerTelephone', '');
    // const rating = get(event, 'rating', 0);
    const status = get(appointment, 'status');
    const disableMap = status === EVENT_STATUS.CANCELED;
    const timezone = get(appointment, 'timezone');

    return (
      <div className={s.container}>
        <div className={s.address}>
          <Place className="icon-normal" color="inherit" />
          <span>{fullAddress}&nbsp;</span>
          <div className={s.map}>
            <IconButton
              color="inherit"
              className="simple-button"
              disabled={disableMap}
              onClick={viewMap}
            >
              <Map color="inherit" />
            </IconButton>
          </div>
        </div>
        <div className={s.bookingInfo}>
          <div className={`${s.serviceName} ellipsis`}>
            {sName}
          </div>
          <div className={s.item}>
            <DateRange className="icon-small" color="secondary" />
            <span>&nbsp;{moment(providerStartSec).format(FULL_DATE)}</span>
          </div>
          <div className={s.item}>
            <Schedule className="icon-small" color="secondary" />
            <span>&nbsp;{moment(providerStartSec).format(TIME_FORMAT)}</span>
            <span>&nbsp;-</span>
            <span>&nbsp;{moment(providerStartSec).add(duration, 'minute').format(TIME_FORMAT)}</span>
          </div>
          <div className={`${s.item} ${s.providerName}`}>
            <HowToReg className="icon-small text-bold" color="inherit" />
            <span>&nbsp;{pName}</span>
          </div>
          <div className={s.item}>
            <PhoneIphone className="icon-small" color="inherit" />
            <span>&nbsp;{pPhone}</span>
          </div>
          <div className={s.item}>
            <Email className="icon-small" color="inherit" />
            <span>&nbsp;{pEmail}</span>
          </div>
          <div className={s.item}>
            <GpsFixed className="icon-small" color="inherit" />
            <span>&nbsp;{timezone}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Event;
