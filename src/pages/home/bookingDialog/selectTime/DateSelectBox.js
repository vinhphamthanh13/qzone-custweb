import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@material-ui/core';
import { InlineDatePicker } from 'material-ui-pickers';

export default function DateSelectBox({ onChange, selectedDay }) {
  return (
    <div className="select-date">
      <Card>
        <CardContent className="select-date_content">
          <InlineDatePicker
            variant="outlined"
            label="Choose a day"
            value={selectedDay.toDate()}
            onChange={onChange}
            format="MM/dd/yyyy"
            disablePast
            keyboard
          />
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
};
