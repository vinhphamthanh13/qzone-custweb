import React, { Component } from 'react';
import {
  bool, func, objectOf, any, string,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Dialog } from '@material-ui/core';
import { postUpdatedProfile } from 'reduxModules/profile.actions';
import Header from './components/Header';
import Content from './components/Content';
import style from './Profile.module.scss';

class Profile extends Component {
  state = {
    isPopupWarning: false,
  };

  componentWillReceiveProps(nextProps) {
    const { updateProfileStatus } = nextProps;
    this.setState({
      isPopupWarning: updateProfileStatus,
    });
  }


  handleAccount = (data) => {
    const { postUpdatedProfile: postUpdatedProfileAction } = this.props;
    postUpdatedProfileAction(data);
    console.log('handle My Account');
  };

  render() {
    const {
      isOpenProfile, handleCloseProfile, userDetail,
    } = this.props;
    const { isPopupWarning } = this.state;
    console.log('isPopupWaring', isPopupWarning);
    const givenName = get(userDetail, 'givenName');
    const email = get(userDetail, 'email');

    return (
      <Dialog fullScreen open={isOpenProfile}>
        <div className={`${style.profile} column`}>
          <Header userDetail={{ givenName, email }} onClose={handleCloseProfile} onOpenAccount={this.handleAccount} />
          <div className={`container-max auto-margin-horizontal ${style.contentAfooter}`}>
            <Content
              givenName={givenName}
              onClose={handleCloseProfile}
              handleAccount={this.handleAccount}
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
  postUpdatedProfile: func.isRequired,
  updateProfileStatus: string,
};

Profile.defaultProps = {
  updateProfileStatus: false,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
  isLoading: state.profilePage.isLoading,
  updateProfileStatus: state.profilePage.updateProfileStatus,
});

export default connect(mapStateToProps, {
  postUpdatedProfile,
})(Profile);
