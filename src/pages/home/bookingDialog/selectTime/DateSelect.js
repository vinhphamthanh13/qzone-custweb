import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@material-ui/core';
import { InlineDatePicker } from 'material-ui-pickers';
import { defaultDateFormat } from 'utils/constants';
import styles from './DateSelect.module.scss';

export default function DateSelect({ onChange, selectedDay }) {
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
        </CardContent>
      </Card>
    </div>
  );
}

DateSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedDay: PropTypes.objectOf(
    Date,
  ).isRequired,
};
