import React from 'react';
import {
  string, node, bool, func,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { noop } from 'utils/constants';
import { Close } from '@material-ui/icons';
import style from './Categorize.module.scss';

const Categorize = (props) => {
  const { name, search, onClose } = props;
  const [categoryStyle, headline] = search ? [style.backdrop, style.searchHeadline] : [style.category, style.headline];
  return (
    <div className={categoryStyle}>
      <div className={style.categorizeHeadline}>
        <Typography classes={{ headline }} variant="headline" color="textSecondary">
          {name}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </div>
      {props.children}
    </div>
  );
};

Categorize.propTypes = {
  name: string.isRequired,
  children: node.isRequired,
  search: bool,
  onClose: func,
};

Categorize.defaultProps = {
  search: false,
  onClose: noop,
};

export default Categorize;
