import React, { Component } from 'react';
import { serviceType } from 'types/global';
import {
  func, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { get, noop } from 'lodash';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
import { saveEarliestSlot } from 'reduxModules/serviceCard.actions';
import EarliestSlot from './EarliestSlot';
import s from './LinkedProviders.module.scss';

class LinkedProviders extends Component {
  state = {
    isExpandList: false,
  };

  handleHiddenBookingButton = () => {
    const { handleBookingButton } = this.props;
    const { isExpandList } = this.state;
    handleBookingButton(isExpandList);
  };

  handleExpandList = () => {
    this.setState(oldState => ({ isExpandList: !oldState.isExpandList }), this.handleHiddenBookingButton);
  };

  handleInstanceSlotBooking = initProvider => (slot) => {
    const {
      service, saveEarliestSlotAction, instantBooking, providerDetail,
    } = this.props;
    const duration = get(service, 'duration');
    const earliestSlot = {
      step: 1,
      bookingDetail: {
        provider: { ...providerDetail, ...initProvider },
        time: {
          start: slot * 1000,
          duration,
        },
      },
    };
    saveEarliestSlotAction(earliestSlot);
    instantBooking();
  };

  renderExpandChevron = (value) => {
    const props = { className: 'icon-main icon-shake galliano-color' };
    return (value ? (
      <ExpandLess {...props} />
    ) : <ExpandMore {...props} />);
  };

  render() {
    const { service, instantBooking } = this.props;
    const { isExpandList } = this.state;
    const linkedProvider = get(service, 'linkedProvider');
    const renderExpandProvider = isExpandList ? (
      <div className={s.expandList}>
        {linkedProvider.map((provider) => {
          const providerName = get(provider, 'providerName');
          const providerId = get(provider, 'providerId');
          const serviceId = get(provider, 'serviceId');
          const providerRating = get(provider, 'rating');
          return (
            <EarliestSlot
              key={uuidv1()}
              providerName={providerName}
              providerId={providerId}
              providerRating={providerRating}
              serviceId={serviceId}
              onSlotBooking={this.handleInstanceSlotBooking(provider)}
              instantBooking={instantBooking}
            />);
        })}
      </div>) : null;

    return (
      <div className={s.providerList}>
        <div className={s.expanderTitle}>
          <Typography variant="subtitle1" color="inherit">
            Discover our providers ({linkedProvider.length})
          </Typography>
          {linkedProvider.length > 0 ? (
            <IconButton className="button-sm" onClick={this.handleExpandList}>
              {this.renderExpandChevron(isExpandList)}
            </IconButton>) : (
              <IconButton className="button-sm simple-button" onClick={noop}>
                <ExpandMore className="icon-main gray-color" />
              </IconButton>)}
        </div>
        {renderExpandProvider}
      </div>
    );
  }
}

LinkedProviders.propTypes = {
  service: serviceType.isRequired,
  instantBooking: func.isRequired,
  handleBookingButton: func.isRequired,
  saveEarliestSlotAction: func.isRequired,
  providerDetail: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  selectProvider: state.homeModules.bookingDialogModules.selectProvider,
  providerDetail: state.providerPage.providerDetail,
});

export default connect(mapStateToProps, {
  saveEarliestSlotAction: saveEarliestSlot,
})(LinkedProviders);
