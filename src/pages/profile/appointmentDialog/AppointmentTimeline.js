import React from 'react';
import {
  arrayOf, shape, string, number,
} from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import TimelineCard from './TimelineCard';

const AppointmentTimeline = ({ items }) => (
  <VerticalTimeline>
    <div>
      {items.sort((a, b) => b.startSec - a.startSec)
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
      slot: shape({
        providerId: string.isRequired,
        serviceId: string.isRequired,
        startSec: number.isRequired,
        toSec: number,
      }).isRequired,
      status: string.isRequired,
      duration: number.isRequired,
    }).isRequired,
  ).isRequired,
};

export default AppointmentTimeline;
