import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { Event, Settings, ExitToApp } from '@material-ui/icons';
import { logout } from 'authentication/actions/logout';

const SIDE_PANEL = [
  {
    name: 'eventList', icon: Event, text: 'My event list', isSelected: false,
  },
  {
    name: 'myInfo', icon: Settings, text: 'My information', isSelected: false,
  },
  {
    name: 'signOut', icon: ExitToApp, text: 'Sign Out', isSelected: false,
  },
];

class SidePanel extends Component {
  initState = SIDE_PANEL.reduce((state, item) => ({
    ...state,
    [item.name]: item.isSelected,
  }), {});

  state = {
    sidePanel: { ...this.initState },
  };

  handleSelectSideMenu = panel => (event) => {
    event.preventDefault();
    this.setState({
      sidePanel: {
        ...this.initState,
        [panel.name]: true,
      },
    });
  };

  renderItems = () => SIDE_PANEL.map((panel, index) => {
    const { sidePanel } = this.state;
    const onClick = this.handleSelectSideMenu(panel, index);
    const className = sidePanel[panel.name] ? 'item selected' : 'item';
    const props = {
      onClick,
      className,
    };
    return (
      <div {...props} key={panel.name}>
        <panel.icon className="main-color qz-icon-padding-small" />
        <Typography variant="subheading" color="textSecondary">{panel.text}</Typography>
      </div>
    );
  });

  handleSignOut = () => {
    const { onClose, logoutAction } = this.props;
    onClose();
    logoutAction();
  };

  render() {
    const { givenName } = this.props;
    return (
      <div className="side-panel">
        <div>
          <Typography variant="subtitle1" color="primary" className="side-panel-title">
            Hello {givenName}
          </Typography>
        </div>
        <div className="side-panel-cta">
          {this.renderItems()}
        </div>
      </div>
    );
  }
}

SidePanel.propTypes = {
  onClose: func.isRequired,
  givenName: string.isRequired,
  logoutAction: func.isRequired,
};

export default connect(null, {
  logoutAction: logout,
})(SidePanel);
