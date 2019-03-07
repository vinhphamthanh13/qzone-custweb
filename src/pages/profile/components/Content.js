import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { Event, Settings, ExitToApp } from '@material-ui/icons';
import { logout } from 'authentication/actions/logout';

class Content extends Component {
  SIDE_PANEL = [
    {
      name: 'eventList', icon: Event, text: 'My event list', isSelected: false,
    },
    {
      name: 'myInfo', icon: Settings, text: 'My information', isSelected: false,
    },
    {
      name: 'signOut',
      icon: ExitToApp,
      text: 'Sign Out',
      isSelected: false,
      func: () => this.handleSignOut(),
    },
  ];

  initState = this.SIDE_PANEL.reduce((initItems, item) => ({
    ...initItems,
    [item.name]: item.isSelected,
  }), {});

  state = {
    sidePanel: { ...this.initState },
  };

  handleSignOut = () => {
    const { onClose, logoutAction } = this.props;
    onClose();
    logoutAction();
  };

  handleSelectSideMenu = panel => (event) => {
    event.preventDefault();
    this.setState({
      sidePanel: {
        ...this.initState,
        [panel.name]: true,
      },
    }, panel.func);
  };

  renderItems = () => this.SIDE_PANEL.map((panel) => {
    const { sidePanel } = this.state;
    const onClick = this.handleSelectSideMenu(panel);
    const [className, textColor] = sidePanel[panel.name] ? ['item selected', 'textPrimary'] : ['item', 'textSecondary'];
    const props = {
      onClick,
      className,
    };
    return (
      <div {...props} key={panel.name}>
        <panel.icon className="main-color qz-icon-padding-small" />
        <Typography variant="subheading" color={textColor}>{panel.text}</Typography>
      </div>
    );
  });

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

Content.propTypes = {
  onClose: func.isRequired,
  givenName: string.isRequired,
  logoutAction: func.isRequired,
};

export default connect(null, {
  logoutAction: logout,
})(Content);
