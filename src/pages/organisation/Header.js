import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTitleBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import Brand from 'components/common/Brand';
import NavBar from 'components/common/NavBar';
import './Organisation.scss';

const styles = theme => ({
  submitButton: {
    border: `1px solid ${theme.palette.primary.light}`,
  },
  paragraph: {
    color: `${theme.palette.primary.light}`,
  },
});

const navBar = (org) => {
  const { url } = org;
  const serviceUrl = `/${url}/service`;
  return ({
    home: {
      label: 'Home',
      path: '/',
      children: [],
    },
    services: {
      label: 'Services',
      path: serviceUrl,
      children: [
        { label: 'Vaccinate', path: `${serviceUrl}/vaccinate` },
        { label: 'Pet Care', path: `${serviceUrl}/pet-care` },
      ],
    },
    favourites: {
      label: 'Favorites',
      path: `/${url}/favorites`,
    },
    help: {
      label: 'Help',
      path: `/${url}/help`,
    },
  });
};

const Header = (props) => {
  const { classes, orgData } = props;
  const menuBar = navBar(orgData);
  return (
    <div className="organisation-page__header">
      <div className="organisation-page__overlay">
        <Grid container direction="row">
          <Grid container direction="row" justify="stretch">
            <Brand />
            <NavBar buttons={menuBar} />
          </Grid>
          <Grid container justify="flex-end">
            <Grid item xs={4}>
              <p className="title text-capitalize">
                we care for your furry little loved ones while you away
              </p>
              <Button className={classes.submitButton}>We take care it</Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  orgData: PropTypes.objectOf(PropTypes.object),
};

Header.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default withStyles(styles)(Header);
