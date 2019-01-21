import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';
import DateSelectBox from './selectTime/DateSelectBox';
import HourSelectBox from './selectTime/HourSelectBox';
import EmptyState from '../services/EmptyState';

export default function SelectTime({
  onDateChange, hourBoxes, selectedDay,
  onHourChange, selectedHour, isLoading,
}) {
  return (
    <div className="select-time-wrapper">
      <DateSelectBox
        selectedDay={selectedDay}
        onChange={onDateChange}
      />
      {
        isLoading
        && <CircularProgress size={50} classes={{ root: 'select-services__loading' }} />
      }
      {
        !isLoading && hourBoxes.length === 0
        && <EmptyState message="No available slot" />
      }
      (
      <HourSelectBox
        hourBoxes={hourBoxes}
        selectedHour={selectedHour}
        onChange={onHourChange}
      />
      )
    </div>
  );
}


SelectTime.propTypes = {
  hourBoxes: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  onDateChange: PropTypes.func.isRequired,
  selectedDay: PropTypes.objectOf(
    Date,
  ).isRequired,
  selectedHour: PropTypes.objectOf(
    Date,
  ),
  onHourChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

SelectTime.defaultProps = {
  selectedHour: null,
};
