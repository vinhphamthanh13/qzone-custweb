import React from 'react';
import { func } from 'prop-types';
import { Button } from '@material-ui/core';
import { Home, Reorder } from '@material-ui/icons';
import logo from 'images/quezone-logo.png';
import s from './Header.module.scss';

const Header = (props) => {
  const { onClose, handleSidePanel } = props;

  return (
    <div className={s.header}>
      <img
        src={logo}
        alt="QZ avatar"
        className={s.headerAvatar}
      />
      <div className={s.headerSupport}>
        <Button variant="text" color="inherit" onClick={onClose} className="hover-bright">
          <Home color="inherit" />
        </Button>
        <Button variant="text" color="inherit" onClick={handleSidePanel} className="hover-bright">
          <Reorder />
        </Button>
      </div>
    </div>
  );
};

Header.propTypes = {
  onClose: func.isRequired,
  handleSidePanel: func.isRequired,
};

export default Header;
