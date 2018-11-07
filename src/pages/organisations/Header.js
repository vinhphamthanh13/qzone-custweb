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
import './Organisation.scss';

const styles = theme => ({
  // root: {
  //   width: 60,
  //   height: 60,
  //   margin: 'auto .3em',
  // },
  paragraph: {
    color: `${theme.palette.primary.light}`,
  },
});

const Header = (props) => {
  const { classes } = props;
  return (
    <div className="organisation-page__header">
      <div className="organisation-page__overlay">
        <Grid container direction="row">
          <Grid container direction="row">
            <Brand />
            <Grid item xs={8}>
              <ul className={classes.paragraph}>
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
        </Grid>
      </div>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Header);
