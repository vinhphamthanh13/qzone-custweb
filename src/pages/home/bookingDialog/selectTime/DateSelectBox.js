import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@material-ui/core';
import { InlineDatePicker } from 'material-ui-pickers';
import { defaultDateFormat } from 'utils/constants';
import styles from './DateSelectBox.module.scss';

export default function DateSelectBox({ onChange, selectedDay, providerTimeZone }) {
  return (
    <div className={styles.selectDate}>
      <Card>
        <CardContent className={styles.selectDateContent}>
          <InlineDatePicker
            variant="outlined"
            label="Choose a day"
            value={selectedDay.toDate()}
            onChange={onChange}
            format={defaultDateFormat}
            disablePast
            keyboard
          />
          <div className={styles.timeZone}>
            Time zone: {providerTimeZone}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

DateSelectBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedDay: PropTypes.objectOf(
    Date,
  ).isRequired,
  providerTimeZone: PropTypes.string.isRequired,
};
