import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Typography } from '@material-ui/core';
import { PROVIDER } from 'config/auth';
import Personal from './info/Personal';
import Delivery from './info/Delivery';
import { infoProps } from '../commonProps';
import s from './Info.module.scss';

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

    return (
      <>
        <div className={s.privateInfo}>
          <div className={s.personalInfo}>
            <div className={s.infoTitle}>
              <Typography variant="title" color="inherit" className="text-bold">
                My data
              </Typography>
            </div>
            <div className={s.infoSubtitle}>
              <Typography variant="subheading" color="inherit" className="text-bold">
                Personal data
              </Typography>
            </div>
            <div className={s.formData}>
              {userId && (
                <Personal
                  userDetail={userDetail}
                  authHeaders={authHeaders}
                  updateInfo={personalCta}
                />
              )}
            </div>
          </div>
          <div className={s.personalInfo}>
            <div className={s.infoTitle}>
              <Typography variant="title" color="inherit" className="text-bold">
                Address
              </Typography>
            </div>
            <div className={s.infoSubtitle}>
              <Typography variant="subheading" color="inherit" className="text-bold">
                Delivery address
              </Typography>
            </div>
            <div className={s.formData}>
              {userId && (
                <Delivery
                  userDetail={userDetail}
                  saveInfo={dispatchUpdateAwsUser}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  infoProps.mapStateToProps,
  infoProps.mapDispatchToProps,
)(Info);
