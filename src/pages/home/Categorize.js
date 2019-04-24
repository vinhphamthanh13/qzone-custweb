import React from 'react';
import {
  string, node, bool, func,
} from 'prop-types';
import { Typography, IconButton } from '@material-ui/core';
import { noop } from 'lodash';
import { Close } from '@material-ui/icons';
import style from './Categorize.module.scss';

const Categorize = (props) => {
  const {
    name, search, onClose, loading,
  } = props;
  const categoryStyle = search ? style.backdrop : style.category;

  return (
    <>
      {loading ? null : (
        <div className={categoryStyle}>
          <div className={style.categorizeHeadline}>
            <Typography variant="headline" color="textSecondary">
              {name}
            </Typography>
            { search && (
              <IconButton onClick={onClose} className="simple-button">
                <Close />
              </IconButton>)
            }
          </div>
          {props.children}
        </div>
      )}
    </>
  );
};

Categorize.propTypes = {
  name: string.isRequired,
  children: node.isRequired,
  search: bool,
  onClose: func,
  loading: bool,
};

Categorize.defaultProps = {
  search: false,
  onClose: noop,
  loading: false,
};

export default Categorize;
