import React from 'react';
import {
  arrayOf, shape, string, number,
} from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import TimelineCard from './TimelineCard';
import { EVENT_STATUS } from './Appointment.constants';
import s from './AppointmentTimeline.module.scss';

const AppointmentTimeline = ({ items }) => {
  const cancelledEvent = items
    .filter(item => item.status === EVENT_STATUS.CANCELED)
    .sort((a, b) => b.startSec - a.startSec);
  const sortEvent = items
    .filter(item => item.status !== EVENT_STATUS.CANCELED)
    .sort((a, b) => b.startSec - a.startSec);
  return (
    <VerticalTimeline className={s.verticalTimeline}>
      {[...sortEvent, ...cancelledEvent]
        .map(item => (
          <TimelineCard
            key={item.id}
            {...item}
          />
        ))
      }
    </VerticalTimeline>
  );
};

AppointmentTimeline.propTypes = {
  items: arrayOf(
    shape({
      id: string.isRequired,
      serviceName: string.isRequired,
      providerName: string.isRequired,
      status: string.isRequired,
      duration: number.isRequired,
    }).isRequired,
  ).isRequired,
};

export default AppointmentTimeline;
