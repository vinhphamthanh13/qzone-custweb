import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import moment from 'moment';
import { AUTHENTICATED_KEY, SESSION } from 'utils/constants';
import { navigateTo, sanitizeName } from 'utils/common';
import CustomModal from 'components/Modal/CustomModal';
import Loading from 'components/Loading';
import Success from 'components/Success';
import Error from 'components/Error';
import { profileProps } from 'pages/profile/commonProps';
import Header from './components/Header';
import Content from './components/Content';
import s from './Profile.module.scss';

class Profile extends Component {
  static propTypes = {
    match: objectOf(any).isRequired,
    dispatchFindEventByCustomerId: func.isRequired,
    dispatchSetWaitLists: func.isRequired,
    dispatchLogout: func.isRequired,
  };

  state = {
    userDetail: {},
    loginSession: {},
    toggleSidePanel: false,
    isSessionTimeout: false,
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail, loginSession, updateProfileStatus, landingPageFactors } = props;
    const {
      userDetail: cachedUserDetail, loginSession: cachedLoginSession, updateProfileStatus: cachedUpdateProfileStatus,
      landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }
    if (updateProfileStatus !== cachedUpdateProfileStatus) {
      updatedState.updateProfileStatus = updateProfileStatus;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchFindEventByCustomerId, dispatchSetWaitLists, match } = this.props;
    const { loginSession } = this.state;
    const userId = get(loginSession, 'id');
    const headers = get(loginSession, 'authHeaders');
    const startSession = get(loginSession, 'start_session');
    const username = get(match, 'params.username');
    const userName = get(loginSession, 'userName');
    if (!userId || sanitizeName(userName) !== sanitizeName(username)) {
      navigateTo('/')();
    } else if (moment().isSameOrAfter(moment(startSession).add(SESSION.TIMEOUT, 'minute'))) {
      this.handlePopupSessionTimeout();
    } else {
      dispatchFindEventByCustomerId(userId, headers);
      dispatchSetWaitLists(userId, headers);
    }
  }

  handlePopupSessionTimeout = () => {
    this.setState({
      isSessionTimeout: true,
    });
  };

  handleLogout = () => {
    const { dispatchLogout } = this.props;
    const { loginSession, landingPageFactors } = this.state;
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const authProvider = get(loginSession, 'authProvider');
    const orgRef = get(landingPageFactors, 'orgRef');
    navigateTo(`/${orgRef}`)();
    dispatchLogout({ isAuthenticated, authProvider });
  };

  handleSidePanel = (value = true) => {
    this.setState(oldState => ({
      toggleSidePanel: value && !oldState.toggleSidePanel,
    }));
  };

  handleRedirectHome = () => {
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef');
    navigateTo(`/${orgRef}`)();
  };

  render() {
    const { loginSession, userDetail, toggleSidePanel, isSessionTimeout } = this.state;
    const givenName = get(userDetail, 'givenName');
    const headers = get(loginSession, 'authHeaders');

    return (
      <>
        <Loading />
        <Error />
        <Success />
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
              onClose={this.handleRedirectHome}
              handleSidePanel={this.handleSidePanel}
            />
            <div className={`container-max auto-margin-horizontal ${s.profileContent}`}>
              <Content
                onClose={this.handleRedirectHome}
                handleLogout={this.handleLogout}
                toggleSidePanel={toggleSidePanel}
                handleSidePanel={this.handleSidePanel}
                authHeaders={headers}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  profileProps.mapStateToProps,
  profileProps.mapDispatchToProps,
)(Profile);
