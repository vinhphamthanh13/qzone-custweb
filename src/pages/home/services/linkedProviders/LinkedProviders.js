import React, { Component } from 'react';
import { serviceType } from 'types/global';
import { func } from 'prop-types';
import { get } from 'lodash';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import EarliestSlot from './EarliestSlot';
import s from './LinkedProviders.module.scss';

class LinkedProviders extends Component {
  state = {
    isExpandList: false,
  };

  handleExpandList = () => {
    this.setState(oldState => ({ isExpandList: !oldState.isExpandList }));
  };

  handleInstanceSlotBooking = (slot) => {
    console.log('instance booking now', slot);
  };

  render() {
    const { service, instantBooking } = this.props;
    const { isExpandList } = this.state;
    const linkedProvider = get(service, 'linkedProvider');
    const expandChevron = isExpandList
      ? <ExpandLess className="icon-main icon-shake malibu-color" />
      : <ExpandMore className="icon-main icon-shake malibu-color" />;

    const renderExpandProvider = isExpandList ? (
      <div className={s.expandList}>
        {linkedProvider.map((provider) => {
          const providerName = get(provider, 'providerName');
          const providerId = get(provider, 'providerId');
          const serviceId = get(provider, 'serviceId');
          return (
            <EarliestSlot
              key={uuidv1()}
              providerName={providerName}
              providerId={providerId}
              serviceId={serviceId}
              onSlotBooking={this.handleInstanceSlotBooking}
              instantBooking={instantBooking}
            />);
        })}
      </div>) : null;

    return (
      <div className={s.providerList}>
        <div className={s.expanderTitle}>
          <Typography variant="body1" color="inherit">
            Discover our providers ({linkedProvider.length})
          </Typography>
          {linkedProvider.length > 0 && (
            <IconButton className="button-sm" onClick={this.handleExpandList}>
              {expandChevron}
            </IconButton>)
          }
        </div>
        {renderExpandProvider}
      </div>
    );
  }
}

LinkedProviders.propTypes = {
  service: serviceType.isRequired,
  instantBooking: func.isRequired,
};

export default LinkedProviders;
