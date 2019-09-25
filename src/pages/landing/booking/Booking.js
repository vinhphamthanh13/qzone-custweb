import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { func, string } from 'prop-types';
// import ClientInfo from './ClientInfo';
import moment from 'moment';
import { get } from 'lodash';
import { Email, PhoneIphone, Place, GpsFixed, Schedule, DateRange } from '@material-ui/icons';
import { bookingProps } from './commonProps';
import s from './Booking.module.scss';

class Booking extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  state = {};

  static getDerivedStateFromProps(props, state) {
    const { selectedBookingDetail } = props;
    const { selectedBookingDetail: cachedBookingDetail } = state;
    const updatedState = {};
    if (JSON.stringify(selectedBookingDetail) !== JSON.stringify(cachedBookingDetail)) {
      updatedState.selectedBookingDetail = selectedBookingDetail;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { selectedBookingDetail } = this.state;
    const sName = get(selectedBookingDetail, 'sName');
    const pName = get(selectedBookingDetail, 'pName');
    const pPhone = get(selectedBookingDetail, 'pPhone');
    const pEmail = get(selectedBookingDetail, 'pEmail');
    const pImage = get(selectedBookingDetail, 'pImage');
    const pAddress = get(selectedBookingDetail, 'pAddress');
    const durationSec = get(selectedBookingDetail, 'durationSec');
    const providerStartSec = get(selectedBookingDetail, 'providerStartSec');
    const timezoneId = get(selectedBookingDetail, 'timezoneId');
    console.log('selected booking detail', selectedBookingDetail);
    return (
      <div className={s.container}>
        <div className={s.details}>
          <div className={s.sName}>{sName}</div>
          <div className={s.content}>
            <div className={s.pImage}><img src={pImage} alt="Q Provider" width="100%" height="100%" /></div>
            <div className={s.pName}>{pName}</div>
            <div className={s.item}>
              <Schedule className="icon-small" color="secondary" />{durationSec}<strong>&nbsp;mins</strong>
            </div>
            <div className={s.item}>
              <DateRange className="icon-small" color="secondary" />
              {moment(providerStartSec).format('dddd, DD-MM-YYYY')}
            </div>
            <div className={s.item}><PhoneIphone className="icon-small" color="inherit" />{pPhone}</div>
            <div className={s.item}><Email className="icon-small" color="inherit" />{pEmail}</div>
            <div className={s.place}>
              <Place className="icon-small" color="secondary" /><span>&nbsp;{pAddress}</span>
            </div>
            <div className={s.item}><GpsFixed className="icon-small" color="inherit" />{timezoneId}</div>
          </div>
        </div>
        <div className={s.clientInfo}>
          s
        </div>
      </div>
    );
  }
}

export default connect(
  bookingProps.mapStateToProps,
)(Booking);
