import React from 'react';
import { func } from 'prop-types';
import { Avatar, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import logo from 'images/quezone-logo.png';

const Header = (props) => {
  const { onClose, onOpenAccount } = props;

  return (
    <div className="header">
      <div className="container-max auto-margin-horizontal">
        <div className="header-title">
          <div className="header-logo">
            <Avatar
              src={logo}
              alt="QZ avatar"
              className="header-avatar"
              imgProps={{
                className: 'header-image',
              }}
            />
          </div>
          <div className="header-support">
            <div className="header-item">
              <Typography variant="body1" color="textSecondary" onClick={onClose}>Home</Typography>
            </div>
            <div className="header-item">
              <Typography variant="body1" color="textSecondary">Help</Typography>
              <ExpandMore className="icon-main" />
            </div>
            <div className="header-item">
              <Typography variant="body1" color="textSecondary" onClick={onOpenAccount}>My account</Typography>
              <ExpandMore className="icon-main" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  onClose: func.isRequired,
  onOpenAccount: func.isRequired,
};

export default Header;
