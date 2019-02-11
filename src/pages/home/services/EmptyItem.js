import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Button } from '@material-ui/core';
import logo from 'images/quezone-logo.png';
import styles from './EmptyItem.module.scss';

export default function EmptyItem({ onLoadServices, message }) {
  return (
    <div className={styles.column}>
      <div>
        <img src={logo} alt="quezone-logo" width="240px" />
      </div>
      <div className={styles.column}>
        <Typography variant="h5" color="textSecondary">{message}</Typography>
        {
          onLoadServices
          && (
            <Button
              className={styles.cta}
              onClick={onLoadServices}
              variant="outlined"
              color="primary"
            >
              Try to get again
            </Button>
          )
        }
      </div>
    </div>
  );
}

EmptyItem.propTypes = {
  onLoadServices: PropTypes.func,
  message: PropTypes.string,
};

EmptyItem.defaultProps = {
  onLoadServices: undefined,
  message: 'No available services',
};
