import React, { Component } from 'react';
import {
  func,
  string,
} from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
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
} from '@material-ui/icons';
import EmptyItem from 'components/EmptyItem';
import {
  setWaitListsAction,
  setCancelWaitListsAction,
} from 'actionsReducers/waitlist.actions';
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

  handleConfirmQueue = () => {
    console.log('confirm Q');
  };

  render() {
    const {
      waitLists,
      serviceProviders,
    } = this.state;

    return (
      <div className={s.waitList}>
        {waitLists && waitLists.length > 0 ? chunk(waitLists, Math.ceil(waitLists.length / 3)).map(row => (
          <div key={uuidv1()} className={s.waitSlotRow}>
            {row.map((item) => {
              const tempService = serviceProviders && serviceProviders.find(
                serviceProvider => serviceProvider.id === item.tempServiceId,
              );
              return (
                <div key={uuidv1()} className={s.waitSlot}>
                  <Typography variant="title" color="inherit" className="text-bold">
                    You are currently in Queue list
                  </Typography>
                  <div className={s.serviceProviderInfo}>
                    <div className="full-width text-center">
                      <Typography variant="title" color="inherit" className="text-bold" noWrap>
                        {get(tempService, 'providerName')}
                      </Typography>
                    </div>
                    <div className="full-width">
                      <Typography variant="subtitle2" color="inherit">
                        {get(tempService, 'geoLocation.fullAddress')}
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
                  <div className={s.serviceName}>
                    <Typography variant="subtitle1" color="inherit" className="text-bold">
                      {get(tempService, 'serviceName')}
                    </Typography>
                  </div>
                  <div className={s.queueCta}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      className="secondary-button"
                      onClick={this.handleCancelQueue(get(item, 'waitListId'))}
                    >
                      <Cancel color="inherit" className="icon-normal" />
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      className="main-button"
                      onClick={this.handleConfirmQueue}
                    >
                      <CheckCircle color="inherit" className="icon-normal" />
                      Confirm
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>)) : (
            <EmptyItem
              message="You have not enrolled in any waitlist at the moment!"
            />
        )}
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
