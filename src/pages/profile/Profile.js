import React, { Component } from 'react';
import {
  bool, func, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  Dialog,
} from '@material-ui/core';
import Header from './components/Header';
import SidePanel from './components/SidePanel';

class Profile extends Component {
  state = {
  };

  render() {
    const { isOpenProfile, handleCloseProfile, userDetails: { givenName, email } } = this.props;
    return (
      <Dialog fullScreen open={isOpenProfile}>
        <div className="column">
          <Header userDetails={{ givenName, email }} onClose={handleCloseProfile} />
          <div className="container-max auto-margin-horizontal">
            <SidePanel givenName={givenName} />
          </div>
        </div>
      </Dialog>
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
