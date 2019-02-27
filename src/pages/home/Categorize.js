import React from 'react';
import { string, node } from 'prop-types';
import { Typography } from '@material-ui/core';
import style from './Categorize.module.scss';

const Categorize = (props) => {
  const { name } = props;
  return (
    <div className={style.category}>
      <Typography classes={{ headline: style.headline }} variant="headline" color="textSecondary">
        {name}
      </Typography>
      {props.children}
    </div>
  );
};

Categorize.propTypes = {
  name: string.isRequired,
  children: node.isRequired,
};

export default Categorize;
