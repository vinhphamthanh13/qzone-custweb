import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Typography,
  Card, CardActionArea, CardContent, LinearProgress,
} from '@material-ui/core';
import styles from './HourSelectBox.module.scss';

export default function HourSelectBox({ hourBoxes = [], onChange, selectedHour }) {
  return (
    <div className={styles.selectHour}>
      <Grid container spacing={8}>
        {hourBoxes.map(({
          startHour, durationSec, spotsTotal, spotsOpen,
        }) => (
          <Grid item sm={3} key={startHour.toISOString()}>
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
                  <Typography variant="subtitle1">{startHour.format('LL')}</Typography>
                  <Grid container className={styles.selectHourContent}>
                    <Typography variant="caption" classes={{ caption: styles.contentDesc }}>From:</Typography>
                    <Typography variant="subtitle2">{startHour.format('LT')}</Typography>
                  </Grid>
                  <Grid container className={styles.selectHourContent}>
                    <Typography variant="caption" classes={{ caption: styles.contentDesc }}>To:</Typography>
                    <Typography variant="subtitle2">{startHour.add(durationSec, 's').format('LT')}</Typography>
                  </Grid>
                  <Grid container className={styles.availableSlots}>
                    <Typography>{spotsOpen} slots</Typography>
                  </Grid>
                  <LinearProgress
                    variant="determinate"
                    classes={{ colorPrimary: styles.availableSlotsColor, barColorPrimary: styles.totalSlotsColor }}
                    value={(spotsOpen / spotsTotal) * 100}
                  />
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
