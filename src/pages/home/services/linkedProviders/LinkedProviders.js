import React, { Component } from 'react';
import { serviceType } from 'types/global';
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

  handleInstanceBooking = (slot) => {
    console.log('instance booking now', slot);
  };

  render() {
    const { service } = this.props;
    const { isExpandList } = this.state;
    const linkedProvider = get(service, 'linkedProvider');
    const expandChevron = isExpandList
      ? <ExpandLess className="icon-main icon-shake malibu-color" />
      : <ExpandMore className="icon-main icon-shake malibu-color" />;
    console.log('service', service);

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
        {isExpandList && (
          <div className={s.expandList}>
            {linkedProvider.map((provider) => {
              const providerName = get(provider, 'providerName');
              const timeSlots = get(provider, 'serviceTimeSlot');
              return (
                <EarliestSlot
                  key={uuidv1()}
                  providerName={providerName}
                  slots={timeSlots}
                  onBooking={this.handleInstanceBooking}
                />);
            })}
          </div>)
        }
      </div>
    );
  }
}

LinkedProviders.propTypes = {
  service: serviceType.isRequired,
};

export default LinkedProviders;
