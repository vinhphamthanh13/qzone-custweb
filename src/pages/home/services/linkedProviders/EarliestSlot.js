import React, { Component } from 'react';
import {
  string, func, objectOf, any,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMoreRounded } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { get } from 'lodash';
import moment from 'moment';
import { fetchProviderSlots } from 'reduxModules/serviceCard.actions';
import { connect } from 'react-redux';
import s from './LinkedProviders.module.scss';

class EarliestSlot extends Component {
  handleSelectBookTime = selectedTime => () => {
    const { onBooking } = this.props;
    onBooking(selectedTime);
  };

  handleFetchProviderSlots = providerId => () => {
    const {
      fetchProviderSlotsAction, serviceId, providerSlots,
    } = this.props;
    const data = {
      customerTimezone: moment.tz.guess(),
      providerId,
      serviceId,
      startSec: (moment.now() + 10000) / 1000,
      toSec: (moment.now() + 10000) / 1000,
    };
    if (!providerSlots[providerId]) {
      fetchProviderSlotsAction(data);
    }
  };

  render() {
    const { providerName, providerSlots, providerId } = this.props;
    const expandIconList = providerSlots[providerId]
      ? null
      : <ExpandMoreRounded className="icon-main icon-shake fruit-color" />;

    return (
      <div>
        <div className={s.providerName}>
          <div className={s.earliestSlot}>
            <Typography variant="body2" color="inherit">
              {providerName}
            </Typography>
            <IconButton className="button-sm" onClick={this.handleFetchProviderSlots(providerId)}>
              {expandIconList}
            </IconButton>
          </div>
        </div>
        {providerSlots[providerId] && (
          <div className={s.providerSlot}>
            {providerSlots[providerId].sort((a, b) => a.startSec - b.startSec).map((slot) => {
              const startSec = get(slot, 'startSec');
              return (
                <div key={uuidv1()} className={`hover-bright ${s.slot}`}>
                  <Typography variant="subheading" color="inherit" onClick={this.handleSelectBookTime(startSec)}>
                    {moment(startSec * 1000).format('HH:mm')}
                  </Typography>
                </div>
              );
            })});
          </div>)}
      </div>
    );
  }
}

EarliestSlot.propTypes = {
  providerName: string.isRequired,
  onBooking: func.isRequired,
  providerId: string.isRequired,
  fetchProviderSlotsAction: func.isRequired,
  providerSlots: objectOf(any).isRequired,
  serviceId: string.isRequired,
};

const mapStateToProps = state => ({
  providerSlots: state.serviceCard.providerSlots,
  searchedId: state.serviceCard.searchedId,
});

export default connect(mapStateToProps, {
  fetchProviderSlotsAction: fetchProviderSlots,
})(EarliestSlot);
