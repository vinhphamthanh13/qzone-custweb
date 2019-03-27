import React, { Component } from 'react';
import {
  string, func, objectOf, any,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMoreRounded } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { get, noop } from 'lodash';
import moment from 'moment';
import { fetchProviderSlots } from 'reduxModules/serviceCard.actions';
import { connect } from 'react-redux';
import CustomLink from 'components/CustomLink';
import s from './LinkedProviders.module.scss';

class EarliestSlot extends Component {
  handleSelectBookTime = selectedTime => () => {
    const { onSlotBooking } = this.props;
    onSlotBooking(selectedTime);
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

  handleFindMoreBooking = () => {
    const { instantBooking } = this.props;
    instantBooking();
  };

  render() {
    const { providerName, providerSlots, providerId } = this.props;
    const expandIconList = providerSlots[providerId]
      ? null
      : <ExpandMoreRounded className="icon-main icon-shake crimson-color" />;

    return (
      <div>
        <div className={s.providerName}>
          <div className={s.earliestTitle}>
            <Typography variant="body2" color="inherit">
              <CustomLink text={providerName} to={`/provider/${providerId}`} />
            </Typography>
            <IconButton className="button-sm" onClick={this.handleFetchProviderSlots(providerId)}>
              {expandIconList}
            </IconButton>
          </div>
        </div>
        {providerSlots[providerId] && (
          <div className={s.providerSlot}>
            <div className={s.availableSlots}>
              { /* Show max 3 earliest slots */ }
              {providerSlots[providerId].sort((a, b) => a.startSec - b.startSec).slice(0, 3).map((slot) => {
                const startSec = get(slot, 'startSec');
                const [slotStyle, onclick] = moment.now() < startSec * 1000
                  ? [`hover-bright ${s.slot} ${s.validSlot}`, this.handleSelectBookTime(startSec)]
                  : [`hover-bright ${s.slot} ${s.invalidSlot}`, noop];

                return (
                  <div key={uuidv1()} className={slotStyle}>
                    <Typography variant="subheading" color="inherit" onClick={onclick}>
                      {moment(startSec * 1000).format('HH:mm')}
                    </Typography>
                  </div>
                );
              })}
            </div>
            <div className={s.findMoreSlots}>
              <Typography
                variant="body2"
                color="inherit"
                onClick={this.handleFindMoreBooking}
                className="hover-pointer"
              >Find more...
              </Typography>
            </div>
          </div>)}
      </div>
    );
  }
}

EarliestSlot.propTypes = {
  providerName: string.isRequired,
  onSlotBooking: func.isRequired,
  providerId: string.isRequired,
  fetchProviderSlotsAction: func.isRequired,
  providerSlots: objectOf(any).isRequired,
  serviceId: string.isRequired,
  instantBooking: func.isRequired,
};

const mapStateToProps = state => ({
  providerSlots: state.serviceCard.providerSlots,
  searchedId: state.serviceCard.searchedId,
});

export default connect(mapStateToProps, {
  fetchProviderSlotsAction: fetchProviderSlots,
})(EarliestSlot);
