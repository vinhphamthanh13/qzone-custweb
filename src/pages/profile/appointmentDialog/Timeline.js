import React from 'react';
import { arrayOf, any } from 'prop-types';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import { EVENT_STATUS } from 'utils/constants';
import TimelineCard from './TimelineCard';
import s from './Timeline.module.scss';

const Timeline = ({ items }) => {
  const cancelledEvent = items.filter(item => item.status === EVENT_STATUS.CANCELED)
    .sort((a, b) => b.startSec - a.startSec);
  const sortEvent = items.filter(item => item.status !== EVENT_STATUS.CANCELED).sort((a, b) => a.startSec - b.startSec);
  return (
    <VerticalTimeline className={s.verticalTimeline}>
      {[...sortEvent, ...cancelledEvent].map(event => (<TimelineCard key={event.id} eventById={event} />))}
    </VerticalTimeline>
  );
};

Timeline.propTypes = {
  items: arrayOf(any).isRequired,
};

export default Timeline;
