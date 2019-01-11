import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card, CardActionArea, CardContent,
} from '@material-ui/core';

function DateSelectBox({ onChange, dateBoxes = [], selectedDay }) {
  return (
    <div className="select-date">
      <Grid container spacing={32}>
        {dateBoxes.map(dateBox => (
          <Grid item sm={4} key={dateBox.getTime()}>
            <Card classes={{
              root: selectedDay === dateBox ? 'select-date__active-item' : '',
            }}
            >
              <CardActionArea onClick={() => onChange(dateBox)}>
                <CardContent className="select-date_content">
                  <p>{dateBox.toDateString()}</p>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function HourSelectBox({ hourBoxes = [], onChange, selectedHour }) {
  return (
    <div className="select-hour">
      <Grid container spacing={8}>
        {hourBoxes.map(hourBox => (
          <Grid item sm={3} key={hourBox.getTime()}>
            <Card classes={{
              root: selectedHour === hourBox ? 'select-date__active-item' : '',
            }}
            >
              <CardActionArea onClick={() => onChange(hourBox)}>
                <CardContent className="select-date_content">
                  <p>{hourBox.getHours()}:{hourBox.getMinutes()}</p>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default function SelectTime({
  onDateChange, dateBoxes, hourBoxes, selectedDay, onHourChange, selectedHour,
}) {
  return (
    <div className="select-time-wrapper">
      <DateSelectBox
        dateBoxes={dateBoxes}
        selectedDay={selectedDay}
        onChange={onDateChange}
      />
      <HourSelectBox
        hourBoxes={hourBoxes}
        selectedHour={selectedHour}
        onChange={onHourChange}
      />
    </div>
  );
}


SelectTime.propTypes = {
  dateBoxes: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
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
};
SelectTime.defaultProps = {
  selectedHour: null,
};

DateSelectBox.propTypes = {
  dateBoxes: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedDay: PropTypes.objectOf(
    Date,
  ).isRequired,
};

HourSelectBox.propTypes = {
  hourBoxes: PropTypes.arrayOf(
    PropTypes.any,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedHour: PropTypes.objectOf(
    Date,
  ),
};
HourSelectBox.defaultProps = {
  selectedHour: null,
};
