import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Header from './Header';

const styles = theme => ({
  root: {
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`,
    justifyContent: 'center',
  },
  wrapper: {
    minWidth: '100%',
    minHeight: '100%',
    justifyContent: 'center',
  },
  paper: {
    borderRadius: 'unset',
    color: `${theme.palette.primary.light}`,
  },
});

const Organisation = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <Grid container>
            <Header />
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

Organisation.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Organisation);
