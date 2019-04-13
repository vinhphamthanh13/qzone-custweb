import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Personal from './info/Personal';
import Delivery from './info/Delivery';
import s from './Info.module.scss';

class Info extends Component {
  handleSaveChangePersonalData = (data) => {
    const { handleAccount } = this.props;
    console.log('this is handle submit', data);
    handleAccount(data);
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
              <Personal userDetail={userDetail} saveInfo={this.handleSaveChangePersonalData} />
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
              <Delivery userDetail={userDetail} saveInfo={this.handleSaveChangePersonalData} />
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
