import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography,
  Card, CardActionArea, CardContent,
} from '@material-ui/core';
import styles from '../SelectTime.module.scss';

export default function HourSelectBox({ hourBoxes = [], onChange, selectedHour }) {
  return (
    <div className={styles.selectHour}>
      <Grid container spacing={8}>
        {hourBoxes.map(({ startHour, durationSec, isAvailable }) => (
          <Grid item sm={3} key={startHour.toISOString()}>
            <Card classes={{
              root: selectedHour && selectedHour.format('LT') === startHour.format('LT')
                ? styles.activeItem : '',
            }}
            >
              <CardActionArea onClick={() => onChange({ start: startHour, duration: durationSec })}>
                <CardContent>
                  <Typography variant="subtitle1">{startHour.format('LT')}</Typography>
                  <Grid container className={styles.selectHourContent}>
                    <Grid item sm={6}>
                      <Typography variant="caption">Duration:</Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="subtitle2">{durationSec / 60} minutes</Typography>
                    </Grid>
                    <Grid
                      container
                      className={`${isAvailable ? styles.available : styles.unavailable}`}
                    >
                      <Grid item sm={12}>
                        <Typography>
                          {isAvailable ? 'Slot available' : 'Slot unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
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
