import React, { Component } from 'react';
import { matchType } from 'types/global';
import SessionManagement from 'components/SessionManagement';
import Error from 'components/Error';
import Success from 'components/Success';
import Profile from './profile/Profile';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { match: { params: { id } } } = this.props;
    return (
      <>
        <Error />
        <Success />
        <SessionManagement />
        <Profile customerId={id} />
      </>
    );
  }
}

ProfilePage.propTypes = {
  match: matchType.isRequired,
};

export default ProfilePage;
