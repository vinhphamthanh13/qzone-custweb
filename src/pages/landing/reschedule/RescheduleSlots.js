import React from 'react';
import { arrayOf, object, func } from 'prop-types';
import { Cancel } from '@material-ui/icons';
import { IconButton, Typography } from '@material-ui/core';
import TimeBoxes from 'pages/booking/components/selectProvider/TimeBoxes';
import s from './RescheduleSlots.module.scss';

const RescheduleSlots = (props) => {
  const { rescheduledSlots, onRescheduleConfirm, closeReschedule } = props;
  return (
    <div className="cover-bg-black">
      <div className={s.rescheduleSlots}>
        <div className={s.title}>
          <Typography
            variant="subheading"
            color="inherit"
            className="text-bold text-uppercase"
          >
            Available time slots!
          </Typography>
          <IconButton
            className={s.cancelReschedule}
            onClick={closeReschedule}
          >
            <Cancel color="inherit" className="icon-big" />
          </IconButton>
        </div>
        <TimeBoxes
          availableSlots={rescheduledSlots}
          onSelectSlot={onRescheduleConfirm}
        />
      </div>
    </div>
  );
};

RescheduleSlots.propTypes = {
  rescheduledSlots: arrayOf(object),
  onRescheduleConfirm: func.isRequired,
  closeReschedule: func.isRequired,
};

RescheduleSlots.defaultProps = {
  rescheduledSlots: [],
};

export default RescheduleSlots;
