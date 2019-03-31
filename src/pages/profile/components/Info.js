import React, { Component } from 'react';
import { objectOf, any } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import s from './Info.module.scss';

class Info extends Component {
  state = {
    isChangePassword: false,
  };

  render() {
    const { userDetail } = this.props;
    const { isChangePassword } = this.state;
    const givenName = get(userDetail, 'givenName');
    console.log('changing pass', isChangePassword);
    return (
      <>
        <div className={s.privateInfo}>
          {givenName}
        </div>
      </>
    );
  }
}

Info.propTypes = {
  userDetail: objectOf(any).isRequired,
};

const mapStateToProps = state => ({
  userDetail: state.auth.userDetail,
});

export default connect(mapStateToProps, null)(Info);
