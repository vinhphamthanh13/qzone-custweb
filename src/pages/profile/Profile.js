import React, { Component } from 'react';
import { func, string, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { logout } from 'authentication/actions/logout';
import { postUpdatedProfile, updateProfileAction } from 'actionsReducers/profile.actions';
import { setServiceProvidersAction, findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { AUTHENTICATED_KEY, SESSION } from 'utils/constants';
import { navigateTo } from 'utils/common';
import CustomModal from 'components/Modal/CustomModal';
import Loading from 'components/Loading';
import Header from './components/Header';
import Content from './components/Content';
import s from './Profile.module.scss';

class Profile extends Component {

  state = {
    userDetail: {},
    loginSession: {},
    isPopupWarning: false,
    toggleSidePanel: false,
    isSessionTimeout: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail, loginSession, updateProfileStatus } = props;
    const { userDetail: cachedUserDetail, loginSession: cachedLoginSession,
      updateProfileStatus: cachedUpdateProfileStatus,
    } = state;
    const updatedState = {};
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (updateProfileStatus !== cachedUpdateProfileStatus) {
      updatedState.updateProfileStatus = updateProfileStatus;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      setServiceProvidersAction: setServiceProviders,
      findEventByCustomerIdAction: findEventByCustomerId,
      customerId,
      loginSession: { authHeaders },
    } = this.props;
    setServiceProviders();
    findEventByCustomerId(customerId, authHeaders);
  }

  componentDidUpdate(prevProps) {
    const { userDetail } = prevProps;
    const { loginSession, userDetail: cachedUserDetail, isSessionTimeout } = this.state;

    const expired = get(loginSession, 'expiration');

    if (JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail) || isEmpty(cachedUserDetail)) {
      navigateTo('/')();
    }

    if (!isSessionTimeout && moment().isAfter(moment(expired))) {
      this.handlePopupSessionTimeout();
    }
  }

  handlePopupSessionTimeout = () => {
    this.setState({
      isSessionTimeout: true,
    });
  };

  handleLogout = () => {
    const { logout: logoutAction } = this.props;
    const { loginSession } = this.state;
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const authProvider = get(loginSession, 'authProvider');
    navigateTo('/')();
    logoutAction({
      isAuthenticated,
      authProvider,
    });
  };

  handleAccount = (data) => {
    const {
      postUpdatedProfile: postUpdatedProfileAction,
      loginSession: { authHeaders },
    } = this.props;
    postUpdatedProfileAction(data, authHeaders);
  };

  resetUpdateProfileStatus = () => {
    const { updateProfileAction: updateProfileStatus } = this.props;
    updateProfileStatus('');
  };

  handleSidePanel = (value = true) => {
    this.setState(oldState => ({
      toggleSidePanel: value && !oldState.toggleSidePanel,
    }));
  };

  render() {
    const {
      updateProfileStatus,
      customerId,
      loginSession: { authHeaders },
    } = this.props;
    const {
      userDetail,
      isPopupWarning,
      toggleSidePanel,
      isSessionTimeout,
    } = this.state;

    const givenName = get(userDetail, 'givenName');
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
        <Loading />
        <CustomModal
          type="error"
          title={SESSION.EXPIRED.title}
          isOpen={isSessionTimeout}
          message={SESSION.EXPIRED.message}
          okButton
          okCallBack={this.handleLogout}
        />
        <div>
          <div className={`${s.profile} column`}>
            <Header
              userName={givenName}
              onClose={navigateTo('/')}
              handleSidePanel={this.handleSidePanel}
            />
            <div className={`container-max auto-margin-horizontal ${s.profileContent}`}>
              <Content
                customerId={customerId}
                givenName={givenName}
                onClose={navigateTo('/')}
                handleAccount={this.handleAccount}
                updateProfileStatus={updateProfileStatus}
                handleLogout={this.handleLogout}
                toggleSidePanel={toggleSidePanel}
                handleSidePanel={this.handleSidePanel}
                authHeaders={authHeaders}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Profile.propTypes = {
  customerId: string.isRequired,
  setServiceProvidersAction: func.isRequired,
  postUpdatedProfile: func.isRequired,
  updateProfileStatus: string,
  updateProfileAction: func.isRequired,
  findEventByCustomerIdAction: func.isRequired,
  logout: func.isRequired,
  loginSession: objectOf(any).isRequired,
};

Profile.defaultProps = {
  updateProfileStatus: false,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.profile,
});

export default connect(mapStateToProps, {
  postUpdatedProfile,
  updateProfileAction,
  setServiceProvidersAction,
  findEventByCustomerIdAction,
  logout,
})(Profile);
