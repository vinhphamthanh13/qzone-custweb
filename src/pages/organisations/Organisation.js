import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from './Header';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    borderRadius: 'unset',
  },
});

const Organisation = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Grid container>
        <Header />
      </Grid>
    </div>
  );
};

Organisation.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Organisation);
