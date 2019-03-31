import React from 'react';
import { func } from 'prop-types';
import { Avatar, Typography } from '@material-ui/core';
// import { noop } from 'utils/constants';
import { ExpandMore } from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import style from './Header.module.scss';

const Header = (props) => {
  const { onClose, onOpenAccount } = props;
  const NAVBAR = [
    {
      id: 0, name: 'Booking', action: onClose, appendIcon: null,
    },
    // {
    //   id: 1, name: 'Help', action: noop, appendIcon: <ExpandMore className="icon-white" />,
    // },
    {
      id: 2, name: 'My account', action: onOpenAccount, appendIcon: <ExpandMore className="icon-white" />,
    },
  ];

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
            { NAVBAR.map(nav => (
              <div key={nav.id} className={style.headerItem}>
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
