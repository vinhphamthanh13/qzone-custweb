import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { Typography } from '@material-ui/core';
import { get } from 'lodash';
import { connect } from 'react-redux';
import Personal from './info/Personal';
import Delivery from './info/Delivery';
import s from './Info.module.scss';

class Info extends Component {
  handleSaveChangePersonalData = () => {
    const { handleAccount, userDetail } = this.props;
    const userSub = get(userDetail, 'userSub');
    const providerInformation = get(userDetail, 'providerInformation');
    const userStatus = get(userDetail, 'userStatus');
    const userType = get(userDetail, 'userType');
    // Todo: resolve userType for customer and provider
    const { personal, address } = this.resolveUserInfoFromProps();
    handleAccount({
      address: {
        city: address.city,
        country: address.country,
        district: address.district,
        postCode: address.postCode,
        state: address.state,
        streetAddress: address.streetAddress,
      },
      email: personal.email,
      familyName: personal.familyName,
      givenName: personal.givenName,
      telephone: personal.telephone,
      id: userSub,
      userSub,
      userType,
      userStatus,
      providerInformation,
    });
  };

  render() {
    const { userDetail } = this.props;
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
              <Personal userDetail={userDetail} />
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
              <Delivery userDetail={userDetail} />
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
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, null)(Info);
