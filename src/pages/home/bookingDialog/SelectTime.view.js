import React from 'react';
import PropTypes from 'prop-types';

import DateSelectBox from './selectTime/DateSelectBox';
import HourSelectBox from './selectTime/HourSelectBox';

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
      {!isLoading && (
        <HourSelectBox
          hourBoxes={hourBoxes}
          selectedHour={selectedHour}
          onChange={onHourChange}
        />
      )}
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
