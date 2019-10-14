import React from 'react';
import { matchType } from 'types/global';
import Error from 'components/Error';
import Success from 'components/Success';
import Profile from './profile/Profile';

const ProfilePage = (props) => {
  const { match } = props;
  return (
    <>
      <Error />
      <Success />
      <Profile match={match} />
    </>
  );
};

ProfilePage.propTypes = {
  match: matchType.isRequired,
};

export default ProfilePage;
