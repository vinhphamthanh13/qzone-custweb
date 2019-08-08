import React from 'react';
import { arrayOf, object } from 'prop-types';
import TimeBoxes from 'pages/booking/components/selectProvider/TimeBoxes';
import s from './RescheduleSlots.module.scss';

const RescheduleSlots = (props) => {
  console.log('reschedule slots', props);
  const { rescheduledSlots } = props;
  return (
    <div className="cover-bg-black">
      <div className={s.rescheduleSlots}>
        <TimeBoxes availableSlots={rescheduledSlots} onSelectSlot={() => {}} />
      </div>
    </div>
  );
};

RescheduleSlots.propTypes = {
  rescheduledSlots: arrayOf(object),
};

RescheduleSlots.defaultProps = {
  rescheduledSlots: [],
};

export default RescheduleSlots;
