import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import OrgAvatar from 'images/dogCare_logo.jpg';
import 'styles/_typography.scss';

const styles = () => ({
  root: {
    width: 60,
    height: 60,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    margin: '3em auto',
  },
});

const Brand = (props) => {
  const { classes, orgName } = props;
  return (
    <Grid item xs={4} className={classes.brand} justify="center">
      <Avatar classes={classes} alt="organization" src={OrgAvatar} />
      <span
        className="header2 text-uppercase text-bold text-margin-left"
      >
        {orgName}
      </span>
    </Grid>
  );
};

Brand.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  orgName: PropTypes.string,
};

Brand.defaultProps = {
  orgName: 'quezone',
};

export default withStyles(styles)(Brand);
