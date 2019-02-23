import React from 'react';
import { objectOf, any } from 'prop-types';
import { Typography } from '@material-ui/core';

const Categorize = (props) => {
  const { categories } = props;
  return (
    <>
      <Typography variant="headline" color="textSecondary">
        {categories.name}
      </Typography>
      {props.children}
    </>
  );
};

Categorize.propTypes = {
  categories: objectOf(any).isRequired,
};

export default Categorize;
