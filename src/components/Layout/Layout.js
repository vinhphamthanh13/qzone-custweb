import React from 'react';
import Logo from 'images/logo.png';
import s from './Layout.module.scss';

const Layout = () => {
  return (
    <div className={s.container}>
      <div className={s.image}>
        <img src={Logo} alt="Quezone" width="100%" height="100%" />
      </div>
      <div className={s.content}>
        <p>
          Quezone is not supporting devices with screen is too small!
        </p>
      </div>
    </div>
  );
};

export default Layout;
