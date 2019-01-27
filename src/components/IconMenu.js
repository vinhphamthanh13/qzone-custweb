import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

const IconMenu = (props) => {
  const { iconSuite, children } = props;

  return (
    <MenuItem onClick={iconSuite.handleMethod}>
      <iconSuite.component className={iconSuite.classes} />
      { children }
    </MenuItem>
  );
};

IconMenu.propTypes = {
  iconSuite: PropTypes.oneOfType(PropTypes.any).isRequired,
  children: PropTypes.oneOfType(PropTypes.any),
};

IconMenu.defaultProps = {
  children: '',
};

export default IconMenu;
