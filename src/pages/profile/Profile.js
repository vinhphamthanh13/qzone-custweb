import React, { Component } from 'react';
import {
  bool, func, objectOf, any, arrayOf, object,
} from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, Typography, Avatar } from '@material-ui/core';
import logo from 'images/quezone-logo.png';
import Header from './components/Header';
import SidePanel from './components/Content';

class Profile extends Component {
  state = {
  };

  handleAccount = () => {
    console.log('handle My Account');
  };

  render() {
    const {
      isOpenProfile, handleCloseProfile, userDetails: { givenName, email },
      customerEventList,
    } = this.props;
    return (
      <Dialog fullScreen open={isOpenProfile}>
        <div className="column">
          <Header userDetails={{ givenName, email }} onClose={handleCloseProfile} onOpenAccount={this.handleAccount} />
          <div className="container-max auto-margin-horizontal">
            <SidePanel givenName={givenName} onClose={handleCloseProfile} />
            <div>{
              customerEventList.map(event => (<div key={event.id}>{event.id}</div>))}
            </div>
          </div>
        </div>
        <div className="copyright">
          <Typography
            variant="body1"
            color="textSecondary"
            classes={{ body1: 'copyText' }}
          >
            &#x24B8; 2019
          </Typography>
          <Avatar
            src={logo}
            classes={{ root: 'footerAvatar' }}
            imgProps={{ className: 'smallAvatar' }}
          />
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
