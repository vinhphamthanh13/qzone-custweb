import React, { Component } from 'react';
import {
  objectOf, any, func, string,
} from 'prop-types';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Personal from './info/Personal';
import Delivery from './info/Delivery';
import s from './Info.module.scss';

class Info extends Component {
  state = {
    userInfo: null,
  };

  componentDidMount() {
    const { userDetail } = this.props;
    const userInfo = {
      email: get(userDetail, 'email'),
      telephone: get(userDetail, 'telephone'),
      givenName: get(userDetail, 'givenName'),
      familyName: get(userDetail, 'familyName'),
      address: get(userDetail, 'address'),
      userSub: get(userDetail, 'userSub'),
      userType: get(userDetail, 'userType'),
      providerInformation: get(userDetail, 'userType') !== 'CUSTOMER' ? get(userDetail, 'providerInformation') : null,
      userStatus: get(userDetail, 'userStatus'),
    };
    this.setState({ userInfo });
  }

  handleSaveChangePersonalData = (data) => {
    const { handleAccount } = this.props;
    const { userInfo } = this.state;
    handleAccount({
      ...userInfo,
      ...data,
    });
  };

  render() {
    const { updateProfileStatus } = this.props;
    const { userInfo } = this.state;

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
              {userInfo && (
                <Personal
                  userInfo={userInfo}
                  saveInfo={this.handleSaveChangePersonalData}
                  updateStatus={updateProfileStatus}
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
              {userInfo && (
                <Delivery
                  userInfo={userInfo}
                  saveInfo={this.handleSaveChangePersonalData}
                  updateStatus={updateProfileStatus}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

Info.propTypes = {
  userDetail: objectOf(any).isRequired,
  handleAccount: func.isRequired,
  updateProfileStatus: string.isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, null)(Info);
