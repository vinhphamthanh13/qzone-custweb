import React from 'react';
import {
  arrayOf, shape, string, number,
} from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import TimelineCard from './TimelineCard';
import s from './AppointmentTimeline.module.scss';

const AppointmentTimeline = ({ items }) => (
  <VerticalTimeline className={s.verticalTimeline}>
    {items.sort((a, b) => b.startSec - a.startSec)
      .map(item => (
        <TimelineCard
          key={item.id}
          {...item}
        />
      ))
    }
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
