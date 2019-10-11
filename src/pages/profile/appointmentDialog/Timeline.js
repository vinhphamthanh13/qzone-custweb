import React from 'react';
import { arrayOf, any, objectOf } from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import { EVENT_STATUS } from 'utils/constants';
import TimelineCard from './TimelineCard';
import s from './Timeline.module.scss';

const Timeline = ({ items, landingPageFactors }) => {
  const orgRef = get(landingPageFactors, 'orgRef', '');
  const cancelledEvent = items
    .filter(item => item.status === EVENT_STATUS.CANCELED)
    .sort((a, b) => b.startSec - a.startSec);
  const expiredEvent = items
    .filter(item => moment().isAfter(item.providerStartSec))
    .sort((a, b) => b.startSec - a.startSec);
  const activeEvent = items
    .filter(item => moment().isSameOrBefore(item.providerStartSec))
    .sort((a, b) => a.startSec - b.startSec);

  return (
    <VerticalTimeline className={s.verticalTimeline}>
      {[...activeEvent, ...expiredEvent, ...cancelledEvent]
        .map(event => (<TimelineCard key={event.id} eventById={event} orgRef={orgRef} />))
      }
    </VerticalTimeline>
  );
};

Timeline.propTypes = {
  items: arrayOf(any).isRequired,
  landingPageFactors: objectOf(any),
};

Timeline.defaultProps = {
  landingPageFactors: {},
};

export default Timeline;
