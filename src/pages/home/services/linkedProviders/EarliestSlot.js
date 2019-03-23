import React, { Component } from 'react';
import { string, func, arrayOf } from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { ExpandMoreRounded, ExpandLessRounded } from '@material-ui/icons';
import uuidv1 from 'uuid/v1';
// import { connect } from 'react-redux';
// import moment from 'moment';
import s from './LinkedProviders.module.scss';

class EarliestSlot extends Component {
  state = {
    isExpandList: false,
  };

  handleSelectBookTime = selectedTime => () => {
    const { onBooking } = this.props;
    onBooking(selectedTime);
  };

  handleExpandSlot = () => {
    this.setState(oldState => ({
      isExpandList: !oldState.isExpandList,
    }));
  };

  render() {
    const { providerName, slots } = this.props;
    const { isExpandList } = this.state;
    const expandIconList = isExpandList
      ? <ExpandLessRounded className="icon-main icon-shake fruit-color" />
      : <ExpandMoreRounded className="icon-main icon-shake fruit-color" />;

    return (
      <div>
        <div className={s.providerName}>
          <div className={s.earliestSlot}>
            <Typography variant="body2" color="inherit">
              {providerName}
            </Typography>
            <IconButton className="button-sm" onClick={this.handleExpandSlot}>
              {expandIconList}
            </IconButton>
          </div>
        </div>
        {isExpandList && (
          <div className={s.providerSlot}>
            {slots.map(slot => (
              <div key={uuidv1()} className={`hover-bright ${s.slot}`}>
                <Typography variant="subheading" color="inherit" onClick={this.handleSelectBookTime(slot.startTime)}>
                  {slot.startTime}
                </Typography>
              </div>
            ))}
          </div>)}
      </div>
    );
  }
}

EarliestSlot.propTypes = {
  providerName: string.isRequired,
  slots: arrayOf(string).isRequired,
  onBooking: func.isRequired,
};

export default EarliestSlot;
