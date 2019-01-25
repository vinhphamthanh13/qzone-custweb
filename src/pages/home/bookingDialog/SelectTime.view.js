import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';
import DateSelectBox from './selectTime/DateSelectBox';
import HourSelectBox from './selectTime/HourSelectBox';
import EmptyState from '../services/EmptyState';
import styles from './SelectTime.view.module.scss';

export default function SelectTime({
  onDateChange, hourBoxes, selectedDay,
  onHourChange, selectedHour, isLoading,
  providerTimeZone,
}) {
  return (
    <div className={styles.selectTimeWrapper}>
      <DateSelectBox
        selectedDay={selectedDay}
        onChange={onDateChange}
        providerTimeZone={providerTimeZone}
      />
      {
        isLoading
        && <CircularProgress size={50} classes={{ root: styles.loading }} />
      }
      {
        !isLoading && hourBoxes.length === 0
        && <EmptyState message="No available slot" />
      }

      <HourSelectBox
        hourBoxes={hourBoxes}
        selectedHour={selectedHour}
        onChange={onHourChange}
      />

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
  providerTimeZone: PropTypes.string.isRequired,
};

SelectTime.defaultProps = {
  selectedHour: null,
};
