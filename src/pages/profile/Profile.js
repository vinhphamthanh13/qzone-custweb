import React, { Component } from 'react';
import {
  bool, func, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid, Dialog, Typography, Button,
} from '@material-ui/core';

class Profile extends Component {
  state = {
    userId: 'PROFILE',
  };

  render() {
    const { userId } = this.state;
    const { isOpenProfile, handleCloseProfile, userDetails: { givenName, email } } = this.props;
    return (
      <Grid container>
        <Dialog fullScreen open={isOpenProfile} onClose={handleCloseProfile}>
          <Typography variant="h1">{userId}</Typography>
          <Typography variant="headline">{givenName}</Typography>
          <Typography variant="subheading">{email}</Typography>
          <Button variant="contained" onClick={handleCloseProfile}>Close</Button>
        </Dialog>
      </Grid>
    );
  }
}

Profile.propTypes = {
  isOpenProfile: bool.isRequired,
  handleCloseProfile: func.isRequired,
  userDetails: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  userDetails: state.auth.userDetails,
});

export default connect(mapStateToProps)(Profile);
