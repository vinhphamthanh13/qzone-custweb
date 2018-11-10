import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const NavBar = (props) => {
  const { buttons } = props;
  const navBar = buttons.map(button => (
    <div key={button.label} className="organisation-page__nav-bar-item">
      <Typography
        variant="subheading"
        className="organisation-page__nav-bar-item"
      >
        {button.label}
      </Typography>
    </div>
  ));
  return (
    <Grid item xs={12} md={4} className="inline-flex">
      {navBar}
    </Grid>
  );
};

NavBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NavBar;
