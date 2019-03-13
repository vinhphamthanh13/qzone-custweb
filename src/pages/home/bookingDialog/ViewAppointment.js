import React from 'react';
import { func } from 'prop-types';
import {
  Grid, Typography, Button, Paper,
} from '@material-ui/core';
import { Assignment, DateRange, Schedule } from '@material-ui/icons';
import mtz from 'moment-timezone';
import { eventType } from 'types/global';
import { defaultDateFormat } from 'utils/constants';
import styles from './ViewAppointment.module.scss';

const ViewAppointment = ({ bookingEvent, handleOpenProfile }) => (
  <Paper square classes={{ root: styles.wrapper }} elevation={1}>
    <Grid container>
      <Grid item xs={12} classes={{ item: styles.titleWrapper }}>
        <div className={styles.titleInner}>
          <Typography variant="h4" classes={{ root: styles.serviceName }}>{bookingEvent.serviceName}</Typography>
          <Button variant="outlined" color="primary" onClick={handleOpenProfile}>
            <Assignment />
            Check your appointments
          </Button>
        </div>
      </Grid>
      <Grid item xs={12} classes={{ item: styles.info }}>
        <div className={styles.leftInfo}>
          <Typography variant="h6">{bookingEvent.providerName}</Typography>
          <Typography variant="body1">{bookingEvent.geoLocation.streetAddress}</Typography>
          <Typography variant="body1">
            {bookingEvent.geoLocation.city} {bookingEvent.geoLocation.state} {bookingEvent.geoLocation.country}
          </Typography>
        </div>
        <div className={styles.rightInfo}>
          <Typography variant="subtitle2" color="secondary">
            {bookingEvent.status}
          </Typography>
          <div>
            <DateRange classes={{ root: styles.appointmentIcon }} />
            <Typography variant="body1" color="primary" inline noWrap>
              {mtz(bookingEvent.slot.startSec * 1000).format(defaultDateFormat)}
            </Typography>
          </div>
          <div>
            <Schedule classes={{ root: styles.appointmentIcon }} />
            <Typography variant="body1" color="primary" inline noWrap>
              {`From ${
                mtz(bookingEvent.slot.startSec * 1000).format('LT')
              } to ${
                mtz((bookingEvent.slot.startSec + bookingEvent.duration * 60) * 1000).format('LT')
              }`}
            </Typography>
          </div>
        </div>
      </Grid>
    </Grid>
  </Paper>
);

ViewAppointment.propTypes = {
  bookingEvent: eventType,
  handleOpenProfile: func.isRequired,
};

ViewAppointment.defaultProps = {
  bookingEvent: undefined,
};

export default React.memo(ViewAppointment);
