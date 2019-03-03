import React from 'react';
import Proptypes from 'prop-types';
import moment from 'moment';
import { Grid, Typography } from '@material-ui/core';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Assignment, DateRange, Schedule } from '@material-ui/icons';

import styles from './Appointment.module.scss';

function TimelineCard({
  serviceName,
  providerName,
  slot: { startSec, toSec },
  duration,
  status,
}) {
  const toSecCalc = (toSec || startSec + duration * 60) * 1000;
  return (
    <VerticalTimelineElement
      iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      icon={<Assignment />}
      date={moment(startSec * 1000).format('l LT')}
      className={styles.appointmentItem}
    >
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="h6">{serviceName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="secondary" className={styles.appointmentStatus}>
            {status}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{providerName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <DateRange className={styles.appointmentIcon} />
          <Typography variant="subheading" color="primary" inline noWrap>
            {moment(startSec * 1000).format('l')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Schedule className={styles.appointmentIcon} />
          <Typography variant="subheading" color="primary" inline noWrap>
            {`From ${moment(startSec * 1000).format('LT')} to ${moment(toSecCalc).format('LT')}`}
          </Typography>
        </Grid>
      </Grid>
    </VerticalTimelineElement>
  );
}

export default function AppointmentTimeline({ items }) {
  return (
    <VerticalTimeline>
      {items.map(item => <TimelineCard key={item.id} {...item} />)}
    </VerticalTimeline>
  );
}

AppointmentTimeline.propTypes = {
  items: Proptypes.arrayOf(
    Proptypes.shape({
      id: Proptypes.string.isRequired,
      serviceName: Proptypes.string.isRequired,
      providerName: Proptypes.string.isRequired,
      slot: Proptypes.shape({
        startSec: Proptypes.number.isRequired,
        toSec: Proptypes.number,
      }).isRequired,
      status: Proptypes.string.isRequired,
      duration: Proptypes.number.isRequired,
    }).isRequired,
  ).isRequired,
};

TimelineCard.propTypes = {
  serviceName: Proptypes.string.isRequired,
  providerName: Proptypes.string.isRequired,
  slot: Proptypes.shape({
    startSec: Proptypes.number.isRequired,
    toSec: Proptypes.number,
  }).isRequired,
  status: Proptypes.string.isRequired,
  duration: Proptypes.number.isRequired,
};
