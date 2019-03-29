import React, { Component } from 'react';
import { func } from 'prop-types';
import { Typography, Avatar } from '@material-ui/core';
import { noop } from 'lodash';
import uuidv1 from 'uuid/v1';
import CustomLink from 'components/CustomLink';
import { Call, Mail } from '@material-ui/icons';
import { basicContact } from 'types/global';
import s from './Header.module.scss';

const navs = [
  {
    label: 'BOOKING',
    action: noop,
    link: '/',
  },
  {
    label: 'ABOUT',
    action: noop,
    link: '/about',
  },
  {
    label: 'CONTACT',
    action: noop,
    link: '/contact',
  },
];

class Header extends Component {
  handleLogin = () => {
    const { login } = this.props;
    login();
  };

  render() {
    const {
      providerContact: {
        name, telephone, email, logo,
      },
    } = this.props;
    return (
      <div className={s.header}>
        <div className={s.miniBanner}>
          <div className={s.contact}>
            <div className="icon-text text-margin-right">
              <Call className="icon-white icon-small" />
              <Typography variant="subtitle1" color="inherit">{telephone}</Typography>
            </div>
            <div className="icon-text">
              <Mail className="icon-white icon-small" />
              <Typography variant="subtitle1" color="inherit">{email}</Typography>
            </div>
          </div>
        </div>
        <div className={`${s.brandAndNav} auto-margin-horizontal`}>
          <div className={s.brand}>
            <div className={s.logo}>
              <Avatar src={logo} alt={email} />
            </div>
            <div>
              <Typography variant="h4" color="inherit" className="text-bold">{name}</Typography>
            </div>
          </div>
          <div className={s.navigation}>
            {navs.map(nav => (
              <div key={uuidv1()} className={s.navItem}>
                <Typography variant="subtitle1" color="inherit">
                  <CustomLink text={nav.label} target="" to={nav.link} />
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  login: func.isRequired,
  providerContact: basicContact.isRequired,
};

export default Header;
