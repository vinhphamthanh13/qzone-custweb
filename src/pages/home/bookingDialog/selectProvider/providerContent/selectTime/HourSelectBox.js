import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography,
  Card, CardActionArea, CardContent,
} from '@material-ui/core';
import { zeroPad } from 'utils/zeroPad';
import styles from './HourSelectBox.module.scss';

const renderTimeBox = (data) => {
  const {
    startTime, duration, timezone, onClick,
  } = data;
  console.log('startTime', startTime);
  console.log('duration', duration);
  console.log('timezone', timezone);

  return (
    <div className="startTime">
      <Typography variant="body2" color="inherit" onClick={onClick(startTime)}>
        {zeroPad(startTime.getHours(), 2)}:{zeroPad(startTime.getMinutes(), 2)}
      </Typography>
    </div>
  );
};

const onClick = time => (event) => {
  if (event) event.preventDefault();
  console.log('hi time', time);
  return time;
};

export default function HourSelectBox({ hourBoxes = {}, onChange, selectedHour }) {
  const startDay = new Date();
  const year = startDay.getFullYear();
  const month = +startDay.getMonth() + 1;
  const date = startDay.getDate();
  const startHourRange = new Date(`${year}-${month}-${date} 00:00`);
  const hourStart = startHourRange.getTime();
  return (
    <div className={styles.selectHour}>
      <Grid container spacing={16}>
        {hourBoxes.sort((a, b) => a.startHour.unix() - b.startHour.unix()).map(box => Object.keys(box).map((timeType) => {
          console.log('hoursbax', hourBoxes);
          console.log('timeType', timeType);
          let hourStep = hourStart;
          const { startHour, displayedStartHour, durationSec } = box[timeType];
          return (
            <Grid item xs={3} key={startHour.toISOString()}>
              <div className="timeTable">
                {Array.from({ length: 47 }, (_, key) => {
                  console.log('key --> ', key);
                  hourStep += 1800000;
                  return renderTimeBox({
                    startTime: new Date(hourStep), duration: 60, timezone: 'asia/saigon', onClick,
                  });
                })}
              </div>
              <Card classes={{
                root: selectedHour && selectedHour.format('LT') === startHour.format('LT')
                  ? styles.activeItem : '',
              }}
              >
                <CardActionArea onClick={() => onChange({
                  start: startHour, duration: durationSec,
                })}
                >
                  <CardContent>
                    <Typography>{displayedStartHour.format('LT')}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        }))
        }
      </Grid>
    </div>
  );
}

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
