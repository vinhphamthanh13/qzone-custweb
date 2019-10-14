import React, { Component } from 'react';
import { func, string, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import { chunk, get } from 'lodash';
import { Typography, Button } from '@material-ui/core';
import { CheckCircle, Clear, DateRange, GpsFixed, Schedule, PhoneIphone, HowToReg, Email } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import { navigateTo } from 'utils/common';
import { FULL_DATE, regExPattern, TIME_FORMAT } from 'utils/constants';
import { waitListsProps } from '../commonProps';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static propTypes = {
    customerId: string.isRequired,
    authHeaders: objectOf(any).isRequired,
    dispatchSetWaitLists: func.isRequired,
    dispatchCanCelWaitLists: func.isRequired,
    dispatchBookEvent: func.isRequired,
  };

  state = {
    waitLists: [],
    cancelWaitLists: null,
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { waitLists, cancelWaitLists, bookedEventDetail, landingPageFactors } = props;
    const {
      waitLists: cachedWaitLists,
      cancelWaitLists: cachedCancelWaitLists,
      bookedEventDetail: cachedBookedEventDetail,
      landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (
      waitLists !== null &&
      JSON.stringify(waitLists) !== JSON.stringify(cachedWaitLists)
    ) {
      updatedState.waitLists = waitLists;
    }
    if (
      cancelWaitLists !== null &&
      cachedWaitLists !== cachedCancelWaitLists
    ) {
      updatedState.cancelWaitLists = cancelWaitLists;
    }
    if (
      bookedEventDetail !== null &&
      bookedEventDetail !== cachedBookedEventDetail
    ) {
      updatedState.bookedEventDetail = bookedEventDetail;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidUpdate(prevProps) {
    const { cancelWaitLists, bookedEventDetail } = prevProps;
    const { dispatchSetWaitLists, customerId, authHeaders } = this.props;
    const {
      cancelWaitLists: cachedCancelWaitLists, bookedEventDetail: cachedBookedEventDetail, landingPageFactors,
    } = this.state;
    if (cachedCancelWaitLists !== null && cancelWaitLists !== cachedCancelWaitLists) {
      dispatchSetWaitLists(customerId, authHeaders);
    }
    if (
      bookedEventDetail !== null &&
      JSON.stringify(bookedEventDetail) !== JSON.stringify(cachedBookedEventDetail)
    ) {
      const bookedEventId = get(cachedBookedEventDetail, 'id');
      if (bookedEventId) {
        const orgRef = get(landingPageFactors, 'orgRef', '');
        navigateTo(`/${orgRef}/event/${bookedEventId}`)();
      }
    }
  }

  handleCancelQueue = waitListId => () => {
    const { dispatchCanCelWaitLists } = this.props;
    dispatchCanCelWaitLists(waitListId);
  };

  handleConfirmQueue = waitList => () => {
    const { dispatchBookEvent } = this.props;
    const customerId = get(waitList, 'customerId');
    const headers = get(waitList, 'authHeaders');
    const duration = get(waitList, 'duration');
    const availabilityId = get(waitList, 'availabilityId');
    const startSec = get(waitList, 'sstartTime').replace(
      regExPattern.ISO_TIME.pattern, regExPattern.ISO_TIME.replaceBy);

    dispatchBookEvent({
      customerId, duration, availabilityId, startSec, status: 'UNSPECIFIED', type: 'APPOINTMENT',
    }, headers);
  };

  render() {
    const { customerId, authHeaders } = this.props;
    const { waitLists } = this.state;
    return (
      <div className={s.waitList}>
        {waitLists && waitLists.length > 0
          ? chunk(waitLists.sort((a, b) => a.startSec - b.startSec),
            Math.ceil(waitLists.length / 3)).map(row => (
              <div key={uuidv1()} className={s.waitSlotRow}>
                {row.map((item) => {
                  const startTime = get(item, 'sstartTime').replace(
                    regExPattern.ISO_TIME.pattern, regExPattern.ISO_TIME.replaceBy,
                  );
                  const queueStatus = get(item, 'status');
                  const pName = get(item, 'providerName');
                  const pEmail = get(item, 'providerEmail');
                  const pPhone = get(item, 'providerPhone');
                  const sName = get(item, 'serviceName');
                  const duration = get(item, 'duration');
                  const timezoneId = get(item, 'timezoneId');
                  const startDate = moment(startTime).format(FULL_DATE);
                  const timeStart = moment(startTime).format(TIME_FORMAT);
                  const timeEnd = moment(startTime).add(duration, 'm').format(TIME_FORMAT);
                  const isExpired = moment.now() > moment(startTime);
                  const [queueTitle, waitSlotStyle] = isExpired
                    ? ['WaitList Expired!', `${s.waitSlot} ${s.waitSlotExpired}`]
                    : [`WaitList is ${queueStatus}`, `${s.waitSlot}`];
                  const activeStyle = isExpired ? '' : `waitSlot${queueStatus}`;

                  return (
                    <div key={uuidv1()} className={waitSlotStyle}>
                      <Typography variant="title" color="inherit" className={`text-bold ${s[activeStyle]}`}>
                        {queueTitle}
                      </Typography>
                      <div className={`${s.sName} ellipsis`}>{sName}</div>
                      <div className={s.providerInfo}>
                        <div className={s.agendaLabel}>
                          Agenda:
                        </div>
                        <div className={s.item}>
                          <DateRange className="icon-small danger-color" />
                          <span>&nbsp;{startDate}</span>
                        </div>
                        <div className={s.item}>
                          <Schedule className="icon-small danger-color" />
                          <span>&nbsp;{timeStart}&nbsp;-</span>
                          <span>&nbsp;{timeEnd}</span>
                        </div>
                        <div className={s.item}>
                          <HowToReg className="icon-small" />
                          <span><strong>{pName}</strong></span>
                        </div>
                        <div className={s.item}>
                          <PhoneIphone className="icon-small" />
                          <span>{pPhone}</span>
                        </div>
                        <div className={s.item}>
                          <Email className="icon-small" />
                          <span>{pEmail}</span>
                        </div>
                        <div className={s.item}>
                          <GpsFixed className="icon-small" />
                          <Typography variant="subtitle2" color="inherit">
                            {timezoneId}
                          </Typography>
                        </div>
                      </div>
                      <div className={s.queueOrder}>
                        <Typography variant="title" color="inherit" className="text-bold">
                          Your queueing order
                        </Typography>
                        <Typography variant="headline" color="inherit" className="text-bold text-medium text-center">
                          {`${get(item, 'position')}`.padStart(3, '0')}
                        </Typography>
                      </div>
                      <div className={s.queueCta}>
                        <Button
                          variant="text"
                          color="inherit"
                          onClick={this.handleCancelQueue(get(item, 'waitListId'))}
                        >
                          <Clear color="inherit" className="icon-normal" />
                          Cancel
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={this.handleConfirmQueue({ customerId, authHeaders, ...item})}
                          disabled={isExpired || queueStatus === 'CONFIRMED'}
                        >
                          <CheckCircle className="icon-normal" />
                          Confirm
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>)) : null}
        {waitLists && waitLists.length === 0 && <EmptyItem  message="No Item Found!" />}
      </div>
    );
  }
}

export default connect(
  waitListsProps.mapStateToProps,
  waitListsProps.mapDispatchToProps
)(WaitList);
