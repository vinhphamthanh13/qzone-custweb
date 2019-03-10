import React from 'react';
import { func } from 'prop-types';
import { Avatar, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import style from './Header.module.scss';

const Header = (props) => {
  const { onClose, onOpenAccount } = props;

  return (
    <div className={style.header}>
      <div className="container-max auto-margin-horizontal">
        <div className={style.headerTitle}>
          <div className={style.headerLogo}>
            <Avatar
              src={logo}
              alt="QZ avatar"
              className={style.headerAvatar}
              imgProps={{
                className: style.headerImage,
              }}
            />
          </div>
          <div className={style.headerSupport}>
            <div className={style.headerItem}>
              <Typography variant="body1" color="textSecondary" onClick={onClose}>Home</Typography>
            </div>
            <div className={style.headerItem}>
              <Typography variant="body1" color="textSecondary">Help</Typography>
              <ExpandMore className="icon-main" />
            </div>
            <div className={style.headerItem}>
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
