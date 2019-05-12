import React from 'react';
import { func } from 'prop-types';
import {
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
  Home,
} from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import s from './Header.module.scss';

const Header = (props) => {
  const { onClose, onOpenAccount } = props;
  const NAVBAR = [
    // {
    //   id: 0, name: 'Booking', action: onClose, appendIcon: null,
    // },
    // {
    //   id: 1, name: 'Help', action: noop, appendIcon: <ExpandMore className="icon-white" />,
    // },
    {
      id: 1, name: 'My account', action: onOpenAccount, appendIcon: <ExpandMore className="icon-white" />,
    },
  ];

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
            <IconButton color="inherit" onClick={onClose}>
              <Home color="inherit" />
            </IconButton>
            { NAVBAR.map(nav => (
              <div key={nav.id} className={s.headerItem}>
                <Typography
                  className="hover-bright white-color"
                  variant="subheading"
                  onClick={nav.action}
                >
                  {nav.name}
                </Typography>
                {nav.appendIcon}
              </div>
            ))}
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
