import React from 'react';
import { arrayOf, any } from 'prop-types';
import moment from 'moment';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import { EVENT_STATUS } from 'utils/constants';
import TimelineCard from './TimelineCard';
import s from './Timeline.module.scss';

const Timeline = ({ items }) => {
  const cancelledEvent = items
    .filter(item => item.status === EVENT_STATUS.CANCELED)
    .sort((a, b) => b.startSec - a.startSec);
  const expiredEvent = items
    .filter(item => moment().isAfter(item.providerStartSec))
    .sort((a, b) => b.startSec - a.startSec);
  const activeEvent = items
    .filter(item => moment().isSameOrBefore(item.providerStartSec))
    .sort((a, b) => a.startSec - b.startSec);
  console.log('cancelledEvent: ', cancelledEvent);
  console.log('expiredEvent: ', expiredEvent);
  console.log('activeEvent: ', activeEvent);

  return (
    <VerticalTimeline className={s.verticalTimeline}>
      {[...activeEvent, ...expiredEvent, ...cancelledEvent]
        .map(event => (<TimelineCard key={event.id} eventById={event} />))
      }
    </VerticalTimeline>
  );
};

Timeline.propTypes = {
  items: arrayOf(any).isRequired,
};

export default Timeline;
