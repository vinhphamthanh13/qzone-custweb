import React from 'react';
import { matchType } from 'types/global';
import Profile from './profile/Profile';

const ProfilePage = (props) => {
  const { match } = props;
  return <Profile match={match} />;
};

ProfilePage.propTypes = {
  match: matchType.isRequired,
};

export default ProfilePage;
