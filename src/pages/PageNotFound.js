import React, { Component } from 'react';
import get from 'lodash/get';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { navigateTo } from 'utils/common';
import logo from 'images/quezone-logo.png';
import { pageNotFoundProps } from 'pages/commonProps';
import s from './PageNotFound.module.scss';

class PageNotFound extends Component {
  state = {
    landingPageFactors: {},
  };

  static getDerivedStateFromProps(props, state) {
    const { landingPageFactors } = props;
    const { landingPageFactors: cachedLandingPageFactors } = state;
    const updatedState = {};
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  };

  handleRedirect = () => {
    const { landingPageFactors } = this.state;
    const orgRef = get(landingPageFactors, 'orgRef', '');
    navigateTo(`/${orgRef}`)();
  };

  render() {

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
              <Typography variant="subheading" className="header1 danger-color">
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
              Oops! Page not found.
            </Typography>
          </div>
        </div>
        <div className={s.linkHome}>
          <Typography
            variant="title"
            className="header2 main-color-04 hover-pointer"
            onClick={this.handleRedirect}
          >
            GO BOOKING
          </Typography>
        </div>
      </div>
    );
  }
}

export default connect(pageNotFoundProps.mapStateToProps)(PageNotFound);
