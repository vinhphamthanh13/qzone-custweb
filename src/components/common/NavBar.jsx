import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
// import Menu from '@material-ui/core/Menu',
// import MenuItem from '@material-ui/core/MenuItem';

const NavBar = (props) => {
  const { buttons } = props;
  const navBar = buttons.map(button => (
    <Button key={button.label}>{button.label}</Button>
  ));
  return (
    <Grid item xs={8}>
      {navBar}
    </Grid>
  );
};

NavBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NavBar;
