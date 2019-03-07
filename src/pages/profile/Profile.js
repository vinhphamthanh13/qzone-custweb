import React, { Component } from 'react';
import {
  bool, func, objectOf, any, arrayOf, object,
} from 'prop-types';
import { connect } from 'react-redux';
import {
  Dialog,
} from '@material-ui/core';
import Header from './components/Header';
import SidePanel from './components/Content';

class Profile extends Component {
  state = {
  };

  render() {
    const {
      isOpenProfile, handleCloseProfile, userDetails: { givenName, email },
      customerEventList,
    } = this.props;
    return (
      <Dialog fullScreen open={isOpenProfile}>
        <div className="column">
          <Header userDetails={{ givenName, email }} onClose={handleCloseProfile} />
          <div className="container-max auto-margin-horizontal">
            <SidePanel givenName={givenName} onClose={handleCloseProfile} />
            <div>{
              customerEventList.map(event => (<div key={event.id}>{event.id}</div>))}
            </div>
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
  customerEventList: arrayOf(object).isRequired,
};

const mapStateToProps = state => ({
  userDetails: state.auth.userDetails,
  customerEventList: state.home.customerEventList,
});

export default connect(mapStateToProps)(Profile);
