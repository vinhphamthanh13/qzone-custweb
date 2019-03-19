import React from 'react';
import {
  arrayOf, shape, string, number, func,
} from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';

import TimelineCard from './TimelineCard';

export default function AppointmentTimeline({ items, rateAppointmentByCustomer }) {
  const rateAppointment = (id, customerId, serviceId) => rating => rateAppointmentByCustomer({
    id, customerId, serviceId, rating,
  });

  return (
    <VerticalTimeline>
      <div>
        {items.sort((a, b) => b.slot.startSec - a.slot.startSec)
          .map(item => (
            <TimelineCard
              key={item.id}
              rateAppointment={rateAppointment(item.id, item.customerId, item.slot.serviceId)}
              {...item}
            />
          ))
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
  rateAppointmentByCustomer: func.isRequired,
};
