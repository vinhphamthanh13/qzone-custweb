import React, { Component } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import { chunk, get } from 'lodash';
import { withFormik } from 'formik';
import {
  Typography,
  Button,
} from '@material-ui/core';
import {
  CheckCircle,
  Cancel,
  DateRange,
  Public,
  AlarmAdd,
} from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import SubLoading from 'components/SubLoading';
import {
  setWaitListsAction,
  setCancelWaitListsAction,
} from 'actionsReducers/waitlist.actions';
import { defaultDateFormat, regExPattern, timeSlotFormat } from 'utils/constants';
import { history } from 'containers/App';
import { setServiceProvidersAction } from 'actionsReducers/common.actions';
import s from './WaitList.module.scss';

class WaitList extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      waitLists,
      serviceProviders,
      cancelWaitLists,
    } = props;
    const {
      waitLists: cachedWaitLists,
      serviceProviders: cachedServiceProviders,
      cancelWaitLists: cachedCancelWaitLists,
    } = state;
    if (
      waitLists !== cachedWaitLists
      || serviceProviders !== cachedServiceProviders
      || cancelWaitLists !== cachedCancelWaitLists
    ) {
      return {
        waitLists,
        serviceProviders,
        cancelWaitLists,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      waitLists: null,
      serviceProviders: null,
    };
  }

  componentDidMount() {
    const {
      setWaitListsAction: setWaitLists,
      setServiceProvidersAction: setServiceProviders,
      customerId,
    } = this.props;
    setWaitLists(customerId);
    setServiceProviders();
  }

  componentDidUpdate(prevProps) {
    const {
      cancelWaitLists,
      setWaitListsAction: setWaitLists,
      customerId,
    } = prevProps;
    const {
      cancelWaitLists: cachedCancelWaitLists,
    } = this.state;
    if (cancelWaitLists !== cachedCancelWaitLists) {
      setWaitLists(customerId);
    }
  }

  handleCancelQueue = waitListId => () => {
    const { setCancelWaitListsAction: setCancelWaitLists } = this.props;
    setCancelWaitLists(waitListId);
  };

  handleConfirmQueue = waitList => () => {
    const waitListId = get(waitList, 'waitListId');
    history.push(`/booking/waitlist/${waitListId}`);
    console.log('confirm Q', waitListId);
  };

  render() {
    const {
      waitLists,
      serviceProviders,
    } = this.state;
    console.log('waitlist State', this.state);
    return (
      <div className={s.waitList}>
        {waitLists && waitLists.length > 0 ? chunk(waitLists, Math.ceil(waitLists.length / 3)).map(row => (
          <div key={uuidv1()} className={s.waitSlotRow}>
            {row.map((item) => {
              const tempService = serviceProviders && serviceProviders.find(
                serviceProvider => serviceProvider.id === item.tempServiceId,
              );
              const startTime = get(item, 'sstartTime');
              const queueStatus = get(item, 'status');
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
                  <div className={s.serviceProviderInfo}>
                    <div className="full-width text-center">
                      <Typography variant="title" color="inherit" className="text-bold" noWrap>
                        {get(tempService, 'providerName')}
                      </Typography>
                    </div>
                    <div className="full-width text-center">
                      <Typography variant="subtitle2" color="inherit">
                        {get(tempService, 'geoLocation.fullAddress')}
                      </Typography>
                    </div>
                    <div className={s.bookedTime}>
                      <div className={`full-width icon-text ${s.schedule}`}>
                        <Typography variant="subtitle2" color="inherit">
                          Start:
                        </Typography>
                        <DateRange className="icon-small" />
                        <Typography variant="subtitle2" color="inherit">
                          {moment(removedTimeZone).format(defaultDateFormat)}
                        </Typography>
                        <AlarmAdd className="icon-small" />
                        <Typography variant="subtitle2" color="inherit">
                          {moment(removedTimeZone).format(timeSlotFormat)}
                        </Typography>
                      </div>
                      <div className={`full-width icon-text ${s.schedule}`}>
                        <Public className="icon-small" />
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
                  <div className={s.serviceName}>
                    <Typography variant="subtitle1" color="inherit" className="text-bold">
                      {get(tempService, 'serviceName')}
                    </Typography>
                  </div>
                  <div className={s.queueCta}>
                    <Button
                      variant="text"
                      color="inherit"
                      className="secondary-button trans-border-button"
                      onClick={this.handleCancelQueue(get(item, 'waitListId'))}
                      disabled={queueStatus === 'CONFIRMED'}
                    >
                      <Cancel color="inherit" className="icon-normal" />
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      className="main-button"
                      onClick={this.handleConfirmQueue(item)}
                      disabled={isExpired || queueStatus === 'CONFIRMED'}
                    >
                      <CheckCircle color="inherit" className="icon-normal" />
                      Confirm
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>)) : null}
        {waitLists && waitLists.length === 0 && (
          <EmptyItem
            message="You have not enrolled in any waitlist at the moment!"
          />
        )}
        {!waitLists ? <SubLoading loading /> : null}
      </div>
    );
  }
}

WaitList.propTypes = {
  setWaitListsAction: func.isRequired,
  setServiceProvidersAction: func.isRequired,
  customerId: string.isRequired,
  setCancelWaitListsAction: func.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.home,
  ...state.waitLists,
});

export default compose(
  withFormik({
    enableReinitialize: true,
  }),
  connect(mapStateToProps, {
    setWaitListsAction,
    setServiceProvidersAction,
    setCancelWaitListsAction,
  }),
)(WaitList);
