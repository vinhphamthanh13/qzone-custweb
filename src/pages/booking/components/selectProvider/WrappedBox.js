import React from 'react';
import { objectOf, any, func } from 'prop-types';
import { get } from 'lodash';
import TimeBoxes from './TimeBoxes';

const WrappedBox = (props) => {
  const { provider, onSelectSlot } = props;
  const availableSlots = get(provider, 'availableSlots');

  return <TimeBoxes onSelectSlot={onSelectSlot} availableSlots={availableSlots} />;
};

WrappedBox.propTypes = {
  provider: objectOf(any).isRequired,
  onSelectSlot: func.isRequired,
};

export default WrappedBox;
