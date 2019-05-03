import React, { Component } from 'react';
import { matchType } from 'types/global';
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
      <Profile customerId={id} />
    );
  }
}

ProfilePage.propTypes = {
  match: matchType.isRequired,
};

export default ProfilePage;