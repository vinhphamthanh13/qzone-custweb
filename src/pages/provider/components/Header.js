import React, { Component } from 'react';
import { func } from 'prop-types';
import { IconButton, Icon } from '@material-ui/core';
import { Call, Mail } from '@material-ui/icons';
import s from './Header.module.scss';

class Header extends Component {
  state = {
    help: '',
  };

  handleLogin = () => {
    const { login } = this.props;
    login();
  };

  render() {
    const { help } = this.state;
    return (
      <div className={s.navigationBar}>
        {help}
        <div className={s.contactPhone}>
          <Call className="icon-white icon-small" />
        </div>
        <div className={s.contactEmail}>
          <Mail className="icon-white icon-small" />
        </div>
        <div className={s.navLogin}>
          <IconButton onClick={this.handleLogin}>
            <Icon className="fab fa-google" />
          </IconButton>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  login: func.isRequired,
};

export default Header;
