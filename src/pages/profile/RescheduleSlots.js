import React from 'react';
import { arrayOf, object, func } from 'prop-types';
import TimeBoxes from 'pages/booking/components/selectProvider/TimeBoxes';
import s from './RescheduleSlots.module.scss';

const RescheduleSlots = (props) => {
  const { rescheduledSlots, onRescheduleConfirm } = props;
  return (
    <div className="cover-bg-black">
      <div className={s.rescheduleSlots}>
        <TimeBoxes availableSlots={rescheduledSlots} onSelectSlot={onRescheduleConfirm} />
      </div>
    </div>
  );
};

RescheduleSlots.propTypes = {
  rescheduledSlots: arrayOf(object),
  onRescheduleConfirm: func.isRequired,
};

RescheduleSlots.defaultProps = {
  rescheduledSlots: [],
};

export default RescheduleSlots;
