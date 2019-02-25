import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { InlineDatePicker } from 'material-ui-pickers';
import mtz from 'moment-timezone';
import { defaultDateFormat } from 'utils/constants';
import { getProviderTimes } from 'reduxModules/home/bookingDialog/selectProvider.actions';
import { bookingDetailType, providerType } from 'types/global';
import styles from './DateSelect.module.scss';

const onDateChange = (
  [selectedDay, setSelectedDay],
  {
    onChange, getProviderTimesAction, providers, initServiceId,
  },
) => (value) => {
  if (!selectedDay.isSame(value, 'day')) {
    const chosenDate = mtz(value);
    const chosenDateByEpoch = chosenDate.unix();
    setSelectedDay(chosenDate);
    onChange(chosenDate, 'day');
    onChange(undefined, 'time');
    getProviderTimesAction({
      serviceId: initServiceId,
      providers,
      startSec: chosenDateByEpoch,
      toSec: chosenDateByEpoch,
    });
  }
};

function DateSelect(props) {
  const initialSelectedDay = props.bookingDetail.day || mtz().add(5, 'minutes');
  const selectedDayState = useState(initialSelectedDay);
  useEffect(() => {
    const initialSelectedDayByUnix = initialSelectedDay.unix();
    props.getProviderTimesAction({
      serviceId: props.initServiceId,
      providers: props.providers,
      startSec: initialSelectedDayByUnix,
      toSec: initialSelectedDayByUnix,
    });
  }, []);

  return (
    <div className={styles.selectDate}>
      <InlineDatePicker
        variant="outlined"
        label="Booking day"
        value={selectedDayState[0].toDate()}
        onChange={onDateChange(selectedDayState, props)}
        format={defaultDateFormat}
        disablePast
        keyboard
      />
    </div>
  );
}

DateSelect.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initServiceId: PropTypes.string.isRequired,
  providers: PropTypes.arrayOf(providerType).isRequired,
  getProviderTimesAction: PropTypes.func.isRequired,
};

export default connect(null, { getProviderTimesAction: getProviderTimes })(DateSelect);
