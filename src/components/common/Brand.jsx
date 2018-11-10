import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import OrgAvatar from 'images/dogCare_logo.jpg';
import 'styles/_typography.scss';

const styles = theme => ({
  root: {
    width: 35,
    height: 35,
    margin: 'auto 1em',
    [theme.breakpoints.up('md')]: {
      width: 60,
      height: 60,
    },
  },
  title: {
    fontWeight: '600',
    color: `${theme.palette.secondary.contrastText}`,
    textTransform: 'uppercase',
  },
});

const Brand = (props) => {
  const { classes, organisationName } = props;
  return (
    <Grid item xs={12} md={6} className="inline-flex">
      <Avatar className={classes.root} alt="organization" src={OrgAvatar} />
      <Typography className={classes.title} variant="headline" color="textSecondary">
        {organisationName}
      </Typography>
    </Grid>
  );
};

Brand.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
  organisationName: PropTypes.string,
};

Brand.defaultProps = {
  organisationName: 'quezone',
};

export default withStyles(styles)(Brand);
