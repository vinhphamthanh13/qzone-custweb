import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTitleBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import './Organisation.scss';
import OrgAvatar from 'images/dogCare_logo.jpg';

const styles = theme => ({
  root: {
    margin: 'auto',
    background: 'url("images/dogCare_org_2.jpg")',
    flexGrow: 1,
    // background: 'rgba(254, 240, 245, 0.8)',
  },
  paragraph: {
    color: `${theme.palette.primary.light}`,
  },
});

const Header = (props) => {
  const { classes } = props;
  return (
    <div className="organisation-page__header">
      <div className="organisation-page__overlay">
        <Grid container direction="row" className="organisation-page__brand">
          <Grid item xs={2}>
            <Avatar
              className="organisation-page__avatar"
              alt="Quezone"
              sizes="32"
              src={OrgAvatar}
            />
          </Grid>
          <Grid item xs={4}>
            <p
              className={classNames(
                classes.paragraph, 'organisation-page__name', 'text-upper', 'text-bold',
              )}
            >
              <span className="organisation-page__name header1">
                Quezone
              </span>
            </p>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item>
            <ul>
              <li>Contact us</li>
              <li>Favorite</li>
              <li>Services</li>
              <li>Sign up</li>
            </ul>
          </Grid>
        </Grid>
        <Grid container justify="flex-end">
          <Grid item xs={4}>
            <p className="title text-capitalize">
              we care for your furry little loved ones while you away
            </p>
            <Button>We take care it</Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Header);
