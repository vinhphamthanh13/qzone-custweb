import React from 'react';
import { objectOf, any } from 'prop-types';
import { Avatar, Typography } from '@material-ui/core';
import logo from 'images/quezone-logo.png';

const Header = (props) => {
  const { userDetails } = props;
  return (
    <div className="profile-header">
      <div className="profile-logo">
        <Avatar
          src={logo}
          alt="QZ avatar"
          className="profile-avatar"
          imgProps={{
            className: 'profile-image',
          }}
        />
      </div>
      <div className="profile-support">
        <Typography variant="subheading" color="textSecondary">{userDetails.givenName}</Typography>
        <Typography variant="subheading" color="textSecondary">Help</Typography>
      </div>
    </div>
  );
};

Header.propTypes = {
  userDetails: objectOf(any).isRequired,
};

export default Header;
