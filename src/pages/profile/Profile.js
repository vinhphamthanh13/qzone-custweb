import React, { Component } from 'react';
import {
  bool, func, objectOf, any, string,
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Dialog } from '@material-ui/core';
import { postUpdatedProfile, updateProfileAction } from 'reduxModules/profile.actions';
import CustomModal from 'components/Modal/CustomModal';
import Header from './components/Header';
import Content from './components/Content';
import style from './Profile.module.scss';

class Profile extends Component {
  state = {
    isPopupWarning: '',
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
  };

  resetUpdateProfileStatus = () => {
    const { updateProfileAction: updateProfileStatus } = this.props;
    updateProfileStatus('');
  };

  render() {
    const {
      isOpenProfile, handleCloseProfile, userDetail, updateProfileStatus,
    } = this.props;
    const { isPopupWarning } = this.state;

    const givenName = get(userDetail, 'givenName');
    const email = get(userDetail, 'email');
    const updateProfileMsgError = isPopupWarning === 'error' ? (
      <CustomModal
        isOpen
        type="error"
        title="Update Profile Error"
        message="Error occurs when updating your profile! Please try again."
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    const updateProfileMsgSuccess = isPopupWarning === 'success' ? (
      <CustomModal
        isOpen
        type="info"
        title="Update Profile Success"
        message="Your profile is up to date"
        onClose={this.resetUpdateProfileStatus}
      />
    ) : null;

    return (
      <>
        {updateProfileMsgError}
        {updateProfileMsgSuccess}
        <Dialog fullScreen open={isOpenProfile}>
          <div className={`${style.profile} column`}>
            <Header userDetail={{ givenName, email }} onClose={handleCloseProfile} onOpenAccount={this.handleAccount} />
            <div className={`container-max auto-margin-horizontal ${style.contentAfooter}`}>
              <Content
                givenName={givenName}
                onClose={handleCloseProfile}
                handleAccount={this.handleAccount}
                updateProfileStatus={updateProfileStatus}
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  }
}

Profile.propTypes = {
  isOpenProfile: bool.isRequired,
  handleCloseProfile: func.isRequired,
  userDetail: objectOf(any).isRequired,
  postUpdatedProfile: func.isRequired,
  updateProfileStatus: string,
  updateProfileAction: func.isRequired,
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
  updateProfileAction,
})(Profile);
