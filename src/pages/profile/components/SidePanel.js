import React from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { Event, Settings, ExitToApp } from '@material-ui/icons';
import { logout } from 'authentication/actions/logout';

const SidePanel = (props) => {
  const { givenName, logoutAction } = props;
  return (
    <div className="side-panel">
      <div>
        <Typography variant="subtitle1" color="primary" className="side-panel-title">
          Hello {givenName}
        </Typography>
      </div>
      <div className="side-panel-cta">
        <div className="item">
          <Event className="main-color qz-icon-padding-small" />
          <Typography variant="subheading" color="textSecondary" className="hover-bright">My event list</Typography>
        </div>
        <div className="item">
          <Settings className="main-color qz-icon-padding-small" />
          <Typography variant="subheading" color="textSecondary">My information</Typography>
        </div>
        <div className="item">
          <ExitToApp className="danger-color qz-icon-padding-small" />
          <Typography variant="subheading" color="textSecondary" onClick={logoutAction}>Sign out</Typography>
        </div>
      </div>
    </div>
  );
};

SidePanel.propTypes = {
  // email: string.isRequired,
  givenName: string.isRequired,
  logoutAction: func.isRequired,
};

export default connect(null, {
  logoutAction: logout,
})(SidePanel);
