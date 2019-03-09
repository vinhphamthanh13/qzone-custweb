import React from 'react';
import { string, node, bool } from 'prop-types';
import { Typography } from '@material-ui/core';
import style from './Categorize.module.scss';

const Categorize = (props) => {
  const { name, search } = props;
  const [categoryStyle, headline] = search ? [style.backdrop, style.searchHeadline] : [style.category, style.headline];
  return (
    <div className={categoryStyle}>
      <Typography classes={{ headline }} variant="headline" color="textSecondary">
        {name}
      </Typography>
      {props.children}
    </div>
  );
};

Categorize.propTypes = {
  name: string.isRequired,
  children: node.isRequired,
  search: bool,
};

Categorize.defaultProps = {
  search: false,
};

export default Categorize;
