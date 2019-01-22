import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import styles from './EmptyState.module.scss';

export default function EmptyState({ onLoadServices, message }) {
  return (
    <div className={styles.wrapper}>
      <Typography variant="display2" className={styles.message}>{message}</Typography>
      {onLoadServices && <Button onClick={onLoadServices} variant="outlined" color="primary">Try to get again</Button>}
    </div>
  );
}

EmptyState.propTypes = {
  onLoadServices: PropTypes.func,
  message: PropTypes.string,
};

EmptyState.defaultProps = {
  onLoadServices: undefined,
  message: 'No available services',
};
