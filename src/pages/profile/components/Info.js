import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { PROVIDER } from 'config/auth';
import Personal from './Personal';
import { infoProps } from '../commonProps';

class Info extends Component {
  static propTypes = {
    dispatchUpdateAwsUser: func.isRequired,
    dispatchUpdateSciUser: func.isRequired,
  };

  state = {
    userDetail: {},
    loginSession: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { userDetail, loginSession } = props;
    const { userDetail: cachedUserDetail, loginSession: cachedLoginSession } = state;
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

    return Object.keys(updatedState) ? updatedState : null;
  }

  render() {
    const { dispatchUpdateAwsUser, dispatchUpdateSciUser } = this.props;
    const { userDetail, loginSession } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const authHeaders = get(loginSession, 'authHeaders');
    const authProvider = get(loginSession, 'authProvider');
    const personalCta = authProvider === PROVIDER.QUEZONE ? dispatchUpdateAwsUser : dispatchUpdateSciUser;

    return userId && <Personal userDetail={userDetail} authHeaders={authHeaders} updateInfo={personalCta} />;
  }
}

export default connect(
  null,
  infoProps.mapDispatchToProps,
)(Info);
