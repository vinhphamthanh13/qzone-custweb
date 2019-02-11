import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core';
import styles from './CustomLoading.module.scss';

export default function CustomLoading({ size, classes }) {
  return (
    <CircularProgress size={size || 50} classes={classes || { root: styles.loading }} />
  );
}

CustomLoading.propTypes = {
  size: PropTypes.number,
  classes: PropTypes.objectOf(PropTypes.string),
};

CustomLoading.defaultProps = {
  size: undefined,
  classes: undefined,
};
