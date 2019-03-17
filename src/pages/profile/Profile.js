import React, { Component } from 'react';
import {
  bool, func, objectOf, any,
} from 'prop-types';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import Header from './components/Header';
import Content from './components/Content';
import style from './Profile.module.scss';

class Profile extends Component {
  handleAccount = () => {
    console.log('handle My Account');
  };

  render() {
    const {
      isOpenProfile, handleCloseProfile, userDetail: { givenName, email },
    } = this.props;

    return (
      <Dialog fullScreen open={isOpenProfile}>
        <div className={`${style.profile} column`}>
          <Header userDetail={{ givenName, email }} onClose={handleCloseProfile} onOpenAccount={this.handleAccount} />
          <div className={`container-max auto-margin-horizontal ${style.contentAfooter}`}>
            <Content
              givenName={givenName}
              onClose={handleCloseProfile}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

Profile.propTypes = {
  isOpenProfile: bool.isRequired,
  handleCloseProfile: func.isRequired,
  userDetail: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps)(Profile);
