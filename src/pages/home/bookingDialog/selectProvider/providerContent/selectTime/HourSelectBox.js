import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography,
  Card, CardActionArea, CardContent,
} from '@material-ui/core';
import styles from './HourSelectBox.module.scss';

export default function HourSelectBox({ hourBoxes = [], onChange, selectedHour }) {
  return (
    <div className={styles.selectHour}>
      <Grid container spacing={16}>
        {hourBoxes.sort((a, b) => a.startHour.unix() - b.startHour.unix()).map(({
          startHour, displayedStartHour, durationSec,
        }) => (
          <Grid item xs={3} key={startHour.toISOString()}>
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
