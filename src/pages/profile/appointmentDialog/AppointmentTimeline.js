import React from 'react';
import {
  arrayOf, shape, string, number,
} from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import TimelineCard from './TimelineCard';
import { STATUS } from './Appointment.constants';

const AppointmentTimeline = ({ items }) => (
  <VerticalTimeline>
    <div>
      {items.sort((a, b) => b.startSec - a.startSec)
        .filter(item => item.status !== STATUS.CANCELED)
        .map(item => (
          <TimelineCard
            key={item.id}
            {...item}
          />
        ))
      }
    </div>
  </VerticalTimeline>
);

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
