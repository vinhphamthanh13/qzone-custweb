import React from 'react';
import {
  func,
  string,
} from 'prop-types';
import {
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';
import {
  Home,
  MoreVert,
} from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import s from './Header.module.scss';

const Header = (props) => {
  const {
    onClose,
    handleSidePanel,
    userName,
  } = props;

  return (
    <div className={s.header}>
      <div className="container-max auto-margin-horizontal full-width">
        <div className={s.headerTitle}>
          <div className={s.headerLogo}>
            <Avatar
              src={logo}
              alt="QZ avatar"
              className={s.headerAvatar}
              imgProps={{
                className: s.headerImage,
              }}
            />
          </div>
          <div className={s.headerSupport}>
            <Button variant="text" color="inherit" onClick={onClose}>
              <Home color="inherit" />
            </Button>
            <Button variant="text" color="inherit" onClick={handleSidePanel}>
              <Typography variant="body1" color="inherit">
                Hi {userName}
              </Typography>
              <MoreVert />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  onClose: func.isRequired,
  handleSidePanel: func.isRequired,
  userName: string.isRequired,
};

export default Header;
