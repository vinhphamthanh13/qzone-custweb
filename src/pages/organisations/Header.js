import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTitleBar from '@material-ui/core/GridListTileBar';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import IconButton from '@material-ui/core/IconButton';
import './Organisation.scss';

const styles = () => ({
  root: {
    margin: 'auto',
    background: 'url("images/dogcare_org_2.jpg")',
    // background: 'rgba(254, 240, 245, 0.8)',
  },
  paragraph: {
    border: '1px solid blue',
  },
});

const Header = (props) => {
  const { classes } = props;
  return (
    <div className="header-card">
      <p className={classes.paragraph}>tst</p>
    </div>
  );
};

Header.propTypes = {
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default withStyles(styles)(Header);
