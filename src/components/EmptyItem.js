import React from 'react';
import { string } from 'prop-types';
import { Typography } from '@material-ui/core';
import logo from 'images/quezone-logo.png';
import s from './EmptyItem.module.scss';

export default function EmptyItem({ message }) {
  return (
    <div className={s.column}>
      <div>
        <img src={logo} alt="quezone-logo" width="220px" />
      </div>
      <Typography variant="h5" color="textSecondary">{message}</Typography>
    </div>
  );
}

EmptyItem.propTypes = {
  message: string,
};

EmptyItem.defaultProps = {
  message: 'No service available!',
};
