import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const NavBar = (props) => {
  const { buttons } = props;
  const navBar = buttons.map(button => (
    <div
      key={button.label}
      className="organisation-page__nav-bar-item"
    >
      {button.label}
    </div>
  ));
  return (
    <Grid item xs={12} sm={12} md={6} className="inline-flex">
      {navBar}
    </Grid>
  );
};

NavBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NavBar;
