import React, { Component } from 'react';
import { func, string, objectOf } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import { chunk, get } from 'lodash';
import { Typography, Button } from '@material-ui/core';
import { CheckCircle, Clear, DateRange, GpsFixed, AlarmAdd, PhoneIphone, HowToReg, Email } from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import { navigateTo } from 'utils/common';
import { defaultDateFormat, regExPattern, timeSlotFormat } from 'utils/constants';
import { waitListsProps } from '../commonProps';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static propTypes = {
    customerId: string.isRequired,
    authHeaders: objectOf(string).isRequired,
    dispatchSetWaitLists: func.isRequired,
    dispatchCanCelWaitLists: func.isRequired,
  };

  state = {
    waitLists: [],
    cancelWaitLists: null,
  };

  static getDerivedStateFromProps(props, state) {
    const { waitLists, cancelWaitLists } = props;
    const { waitLists: cachedWaitLists, cancelWaitLists: cachedCancelWaitLists } = state;
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

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchSetWaitLists, customerId, authHeaders } = this.props;
    dispatchSetWaitLists(customerId, authHeaders);
  }

  componentDidUpdate(prevProps) {
    const { cancelWaitLists } = prevProps;
    const { dispatchSetWaitLists, customerId, authHeaders } = this.props;
    const { cancelWaitLists: cachedCancelWaitLists } = this.state;
    if (cachedCancelWaitLists !== null && cancelWaitLists !== cachedCancelWaitLists) {
      dispatchSetWaitLists(customerId, authHeaders);
    }
  }

  handleCancelQueue = waitListId => () => {
    const { dispatchCanCelWaitLists } = this.props;
    dispatchCanCelWaitLists(waitListId);
  };

  handleConfirmQueue = waitList => () => {
    const waitListId = get(waitList, 'waitListId');
    navigateTo(`/booking/waitlist/${waitListId}`)();
  };

  render() {
    const { waitLists } = this.state;
    return (
      <div className={s.waitList}>
        {waitLists && waitLists.length > 0
          ? chunk(waitLists.sort((a, b) => a.startSec - b.startSec),
            Math.ceil(waitLists.length / 3)).map(row => (
              <div key={uuidv1()} className={s.waitSlotRow}>
                {row.map((item) => {
                  const startTime = get(item, 'sstartTime');
                  const queueStatus = get(item, 'status');
                  const pName = get(item, 'providerName');
                  const pEmail = get(item, 'providerEmail');
                  const pPhone = get(item, 'providerPhone');
                  const sName = get(item, 'serviceName');
                  const removedTimeZone = startTime.replace(regExPattern.removedTimeZone, '');
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
                        <div className="full-width flex text-center ellipsis subtitle item-center text-capitalize">
                          <HowToReg className="icon-small" />
                          <span>{pName}</span>
                        </div>
                        <div className="full-width flex text-center ellipsis item-center">
                          <PhoneIphone className="icon-small" />
                          <span>{pPhone}</span>
                        </div>
                        <div className="full-width flex text-center ellipsis item-center">
                          <Email className="icon-small" />
                          <span>{pEmail}</span>
                        </div>
                        <div className={s.bookedTime}>
                          <div className={`full-width icon-text ${s.schedule}`}>
                            <div className={s.agendaLabel}>
                              Agenda:
                            </div>
                            <DateRange className="icon-small danger-color" />
                            <Typography variant="subtitle2" color="inherit">
                              {moment(removedTimeZone).format(defaultDateFormat)}
                            </Typography>
                            <AlarmAdd className="icon-small danger-color" />
                            <Typography variant="subtitle2" color="inherit">
                              {moment(removedTimeZone).format(timeSlotFormat)}
                            </Typography>
                          </div>
                          <div className={`full-width icon-text ${s.schedule}`}>
                            <GpsFixed className="icon-small" />
                            <Typography variant="subtitle2" color="inherit">
                              {get(item, 'timezoneId')}
                            </Typography>
                          </div>
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
                          disabled={queueStatus === 'CONFIRMED'}
                        >
                          <Clear color="inherit" className="icon-normal" />
                          Cancel
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          className="fruit-color"
                          onClick={this.handleConfirmQueue(item)}
                          disabled={isExpired || queueStatus === 'CONFIRMED'}
                        >
                          <CheckCircle className="icon-normal fruit-color" />
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
