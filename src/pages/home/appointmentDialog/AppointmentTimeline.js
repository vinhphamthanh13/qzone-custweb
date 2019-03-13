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
  // Update,
} from '@material-ui/icons';
import CountDown from 'react-countdown-now';
import styles from './Appointment.module.scss';

const STATUS = {
  WAITING: 'Waiting',
  COUNTDOWN: 'Counting down',
  EXPIRED: 'Expired',
};

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
      STATUS.EXPIRED,
      <DoneAll className="icon-main" />,
      styles.eventStatusComplete,
    ]
    : [
      { background: 'rgb(87, 201, 249)', color: '#fff' },
      <AlarmOn />,
      STATUS.WAITING,
      <AirlineSeatReclineNormal className="icon-main" />,
      styles.eventStatusWaiting,
    ];

  const remainTimeHr = remainTimeSec < 0 ? Math.abs(remainTimeSec) / 3600 : 0;
  const remainDay = remainTimeHr > 24 ? remainTimeHr / 24 : 0;
  const remainTimeMn = (remainTimeHr % 1) * 60;
  const waitingDay = parseInt(remainDay, 0);
  const waitingHr = waitingDay ? parseInt((remainDay % 1) * 24, 0) : parseInt(remainTimeHr, 0);
  const waitingMn = parseInt(remainTimeMn, 0);

  let displayTimeout = null;
  if (waitingDay) {
    displayTimeout = `${waitingDay} day, ${waitingHr} hr, ${waitingMn} min`;
  } else if (remainTimeHr < 1 && remainTimeMn > 0) {
    displayTimeout = <CountDown date={Date.now() + (remainTimeMn * 60 * 1000)} />;
  } else {
    displayTimeout = `${waitingHr} hr, ${waitingMn} min`;
  }

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
          {displayTimeout}
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
