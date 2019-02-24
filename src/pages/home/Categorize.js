import React from 'react';
import { objectOf, any, node } from 'prop-types';
import { Typography } from '@material-ui/core';
import style from './Categorize.module.scss';

const Categorize = (props) => {
  const { categories } = props;
  return (
    <div className={style.category}>
      <Typography classes={{ headline: style.headline }} variant="headline" color="textSecondary">
        {categories.name}
      </Typography>
      {props.children}
    </div>
  );
};

Categorize.propTypes = {
  categories: objectOf(any).isRequired,
  children: node.isRequired,
};

export default Categorize;
