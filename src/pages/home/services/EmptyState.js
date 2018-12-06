import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import './EmptyState.scss';

export default function EmptyState({ onLoadServices }) {
  return (
    <div className="empty-state__wrapper">
      <Typography variant="display2" className="empty-state__message">No available services</Typography>
      <Button onClick={onLoadServices} variant="outlined" color="primary">Try to get again</Button>
    </div>
  );
}

EmptyState.propTypes = {
  onLoadServices: PropTypes.func.isRequired,
};
