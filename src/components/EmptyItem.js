import React from 'react';
import { string } from 'prop-types';
import { Typography } from '@material-ui/core';
import { LocalFlorist } from '@material-ui/icons';
import s from './EmptyItem.module.scss';

export default function EmptyItem({ message, size }) {
  return (
    <div className={s.column}>
      <div>
        <LocalFlorist className={`main-color icon-${size}`} />
      </div>
      <Typography variant="h6" color="textSecondary">{message}</Typography>
    </div>
  );
}

EmptyItem.propTypes = {
  message: string,
  size: string,
};

EmptyItem.defaultProps = {
  message: 'No Item Found',
  size: 'big', // normal, big, lg, huge
};
