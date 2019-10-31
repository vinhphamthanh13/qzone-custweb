import React from 'react';
import { string } from 'prop-types';
import { Typography } from '@material-ui/core';
import { LocalFlorist } from '@material-ui/icons';
import s from './EmptyItem.module.scss';

export default function EmptyItem({ message, size, className }) {
  return (
    <div className={`${s.column} ${className}`}>
      <div>
        <LocalFlorist className={`main-color icon-${size}`} />
      </div>
      <Typography variant="h6" color="inherit">{message}</Typography>
    </div>
  );
}

EmptyItem.propTypes = {
  message: string,
  size: string,
  className: string,
};

EmptyItem.defaultProps = {
  message: 'No Item Found',
  size: 'big', // normal, big, lg, huge
  className: '',
};
