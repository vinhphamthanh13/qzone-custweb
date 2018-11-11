import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const NavBar = (props) => {
  const { buttons } = props;
  const navBar = buttons.map(button => (
    <div key={button.label}>
      <Typography>
        <Link className="organisation-page__nav-bar-item mako text-bold" to={button.path}>{button.label}</Link>
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
