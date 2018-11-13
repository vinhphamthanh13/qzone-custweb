import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const NavBar = (props) => {
  const { buttons, linkClass } = props;
  const navBar = buttons.map(button => (
    <div key={button.label}>
      <Typography>
        <Link className={linkClass} to={button.path}>{button.label}</Link>
      </Typography>
    </div>
  ));
  return (
    <Grid item xs={12} sm={6} md={4} className="inline-flex">
      {navBar}
    </Grid>
  );
};

NavBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkClass: PropTypes.string,
};

NavBar.defaultProps = {
  linkClass: '',
};

export default NavBar;
