import React from 'react';
import {
  arrayOf, shape, string, number, objectOf, any,
} from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import {
  DateRange, Schedule, AlarmOff, AlarmOn,
  AirlineSeatReclineNormal, DoneAll,
} from '@material-ui/icons';

import styles from './Appointment.module.scss';

function TimelineCard({
  serviceName,
  providerName,
  slot: { startSec, toSec },
  duration,
  // status,
  geoLocation: {
    city, country,
    district, postCode, state,
    streetAddress,
  },
}) {
  const toSecCalc = (toSec || startSec + duration * 60) * 1000;
  const current = new Date();
  const currentSec = current.getTime() / 1000;
  const remainTimeSec = currentSec - (+startSec);
  const [eventStyle, iconTimeline, eventStatus, iconStatus, styleStatus] = remainTimeSec > 0
    ? [
      { background: 'rgb(61, 63, 66)', color: '#fff' },
      <AlarmOff />,
      'Completed',
      <DoneAll className="icon-main" />,
      styles.eventStatusComplete,
    ]
    : [
      { background: 'rgb(33, 150, 243)', color: '#fff' },
      <AlarmOn />,
      'Waiting',
      <AirlineSeatReclineNormal className="icon-main" />,
      styles.eventStatusWaiting,
    ];

  const remainTimeHr = remainTimeSec < 0 ? Math.abs(remainTimeSec) / 3600 : 0;
  const remainTimeMn = (remainTimeHr % 1) * 60;
  const waitingHr = parseInt(remainTimeHr, 0);
  const waitingMn = parseInt(remainTimeMn, 0);

  return (
    <VerticalTimelineElement
      iconStyle={eventStyle}
      icon={iconTimeline}
      className={styles.cardContainer}
    >
      <div>
        <Typography variant="h6" color="primary" noWrap align="center">
          {streetAddress}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle1" color="textSecondary" align="center">
          {district} {state} {postCode} - {city} {country}
        </Typography>
      </div>
      <div className={styles.appointmentCode}>
        <Typography variant="headline" color="secondary" align="center" classes={{ headline: styles.textCode }}>
          S-123456
        </Typography>
      </div>
      <div>
        <Typography variant="h6" color="textSecondary">{serviceName}</Typography>
        <Typography variant="subheading" color="textSecondary">{providerName}</Typography>
        <div className={styles.appointmentItem}>
          <DateRange className="icon-main" />
          <Typography variant="subheading" color="primary" inline noWrap>
            {moment(startSec * 1000).format('l')}
          </Typography>
        </div>
        <div className={styles.appointmentItem}>
          <Schedule className="icon-main" />
          <Typography variant="subheading" color="primary" inline noWrap>
            {`From ${moment(startSec * 1000).format('LT')} to ${moment(toSecCalc).format('LT')}`}
          </Typography>
        </div>
      </div>
      <div className={styles.appointmentItem}>
        {iconStatus}
        <Typography variant="subheading" color="secondary">{eventStatus}</Typography>
      </div>
      <div className={`${styles.appointmentRemainedTime} ${styleStatus}`}>
        <AlarmOn className="icon-white" />
        <Typography variant="subheading" color="secondary" classes={{ subheading: styles.remainedText }}>
          {waitingHr} hr, {waitingMn} min
        </Typography>
      </div>
    </VerticalTimelineElement>
  );
}

export default function AppointmentTimeline({ items }) {
  return (
    <VerticalTimeline>
      <div>
        {items.sort((a, b) => b.slot.startSec - a.slot.startSec)
          .map(item => (<TimelineCard key={item.id} {...item} />))
        }
      </div>
    </VerticalTimeline>
  );
}

AppointmentTimeline.propTypes = {
  items: arrayOf(
    shape({
      id: string.isRequired,
      serviceName: string.isRequired,
      providerName: string.isRequired,
      slot: shape({
        startSec: number.isRequired,
        toSec: number,
      }).isRequired,
      status: string.isRequired,
      duration: number.isRequired,
    }).isRequired,
  ).isRequired,
};

TimelineCard.propTypes = {
  serviceName: string.isRequired,
  providerName: string.isRequired,
  slot: shape({
    startSec: number.isRequired,
    toSec: number,
  }).isRequired,
  // status: string.isRequired,
  duration: number.isRequired,
  geoLocation: objectOf(any).isRequired,
};
