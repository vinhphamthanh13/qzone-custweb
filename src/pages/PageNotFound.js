import React from 'react';
import { Typography } from '@material-ui/core';
import { history } from 'containers/App';
import logo from 'images/quezone-logo.png';

import s from './PageNotFound.module.scss';

function PageNotFound() {
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <img src={logo} alt="Quezone Logo" className={s.headerLogo} />
      </div>
      <div className={s.content}>
        <div className={s.fourOldFour}>
          <div className={s.numberFour}>
            <Typography variant="title" color="inherit" className="banner danger-color">
              4
            </Typography>
          </div>
          <div className={s.numberZero}>
            <Typography variant="title" color="inherit" className="sub-banner danger-color">
              0
            </Typography>
            <Typography variant="subheading" className="header1 main-color-03">
              ERROR
            </Typography>
          </div>
          <div className={s.numberFourInvert}>
            <Typography variant="title" color="inherit" className="banner danger-color">
              4
            </Typography>
          </div>
        </div>
        <div className={s.slogan404}>
          <Typography variant="title" color="inherit">
            Oh no! Page not found.
          </Typography>
        </div>
      </div>
      <div className={s.linkHome}>
        <Typography
          variant="title"
          className="header2 main-color-04 hover-pointer"
          onClick={() => { history.push('/'); }}
        >
          GO BOOKING
        </Typography>
      </div>
    </div>
  );
}

export default PageNotFound;
