import React from 'react';
import {
  objectOf, oneOfType, any,
} from 'prop-types';
import { MenuItem, IconButton } from '@material-ui/core';

const IconMenu = (props) => {
  const { iconSuite, children } = props;
  return (
    <MenuItem onClick={iconSuite.handleMethod}>
      <IconButton>
        <iconSuite.component className={iconSuite.classes} />
      </IconButton>
      { children }
    </MenuItem>
  );
};

IconMenu.propTypes = {
  iconSuite: objectOf(any).isRequired,
  children: oneOfType([any]),
};

IconMenu.defaultProps = {
  children: '',
};

export default IconMenu;
