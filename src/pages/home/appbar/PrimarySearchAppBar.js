import React from 'react';
import {
  objectOf, any, func, arrayOf, object, string, bool,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { noop } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Typography, Button,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  AssignmentInd,
  Notifications as NotificationsIcon,
  Fingerprint, FindInPage,
} from '@material-ui/icons';
import { fetchCustomerEvents } from 'reduxModules/home.actions';
import logo from 'images/quezone-logo.png';
import styles from './PrimarySearchAppBarStyle';

class PrimarySearchAppBar extends React.Component {
  componentDidMount() {
    const { loginSession, fetchCustomerEventsAction } = this.props;
    const [isAuthenticated, id] = loginSession
      ? [loginSession.isAuthenticated, loginSession.id] : [false, ''];
    if (isAuthenticated) {
      fetchCustomerEventsAction(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loginSession } = nextProps;
    const { fetchCustomerEventsAction, loginSession: prevSession } = this.props;
    const { isAuthenticated, id } = loginSession;
    const { isAuthenticated: prevAuthenticated } = prevSession;
    if (isAuthenticated && isAuthenticated !== prevAuthenticated) {
      fetchCustomerEventsAction(id);
    }
  }

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
  };

  handleOpenProfileDialog = () => {
    const { handleOpenProfile } = this.props;
    handleOpenProfile();
  };

  handleActionAdvancedSearch = () => {
    const { handleAdvancedSearch, maintenance } = this.props;
    if (!maintenance) {
      handleAdvancedSearch();
    }
  };

  render() {
    const {
      classes, loginSession, onSearch, customerEventList, onSearchValue, maintenance,
    } = this.props;
    const currentTime = moment.now();
    const eventCount = customerEventList
      && customerEventList.filter(event => event.slot.startSec * 1000 > currentTime).length;
    const badgeStyle = eventCount > 0 ? 'text-margin-lr hover-pointer' : 'text-margin-lr';
    const isAuthenticated = loginSession ? loginSession.isAuthenticated : false;
    const [authLabel, openForm] = maintenance ? ['Sign Up', 'isRegisterOpen'] : ['Sign In', 'isLoginOpen'];
    const customUser = isAuthenticated ? (
      <>
        <Typography
          aria-haspopup="true"
          color="inherit"
          variant="subheading"
          className={`text-capitalize text-margin-lr ${classes.desktopView}`}
        >
          Hello {loginSession.username}!
        </Typography>
        <Badge
          onClick={eventCount > 0 ? this.handleOpenProfileDialog : noop}
          badgeContent={eventCount}
          color="secondary"
          className={badgeStyle}
        >
          <NotificationsIcon />
        </Badge>
        <IconButton onClick={this.handleOpenProfileDialog} color="inherit">
          <AssignmentInd />
        </IconButton>
      </>
    ) : (
      <>
        <div className={classes.desktopView}>
          <Typography
            color="inherit"
            variant="subtitle1"
            onClick={() => this.handleAuthenticateUser(openForm)}
            className="hover-pointer hover-bright text-margin-right"
          >
            {authLabel}
          </Typography>
          <Fingerprint />
        </div>
        <div className={classes.mobileView}>
          <IconButton aria-haspopup="true" onClick={() => this.handleAuthenticateUser(openForm)} color="inherit">
            <Fingerprint />
          </IconButton>
        </div>
      </>
    );
    const adSearchStyle = maintenance ? 'icon-main gray-color' : 'icon-main white-color';
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar className={`${classes.mainLinear}`}>
            <Avatar
              className={classes.avatar}
              imgProps={{
                className: classes.img,
              }}
              alt="Quezone Logo"
              src={logo}
            />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Services, organisations …"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={onSearch}
                value={onSearchValue}
                disabled={maintenance}
              />
            </div>
            <Typography variant="subheading" className={adSearchStyle}>
              or
            </Typography>
            <div className="advanced-search-app-bar">
              <Button onClick={this.handleActionAdvancedSearch} className="simple-button">
                <FindInPage className={adSearchStyle} />
                <Typography className={adSearchStyle} variant="subheading">Advanced search
                </Typography>
              </Button>
            </div>
            <div className={classes.grow} />
            { customUser }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PrimarySearchAppBar.propTypes = {
  classes: objectOf(any).isRequired,
  handleAuthenticate: func.isRequired,
  onSearch: func.isRequired,
  loginSession: objectOf(any).isRequired,
  fetchCustomerEventsAction: func.isRequired,
  handleOpenProfile: func.isRequired,
  customerEventList: arrayOf(object).isRequired,
  onSearchValue: string,
  handleAdvancedSearch: func.isRequired,
  maintenance: bool.isRequired,
};

PrimarySearchAppBar.defaultProps = {
  onSearchValue: '',
};

const mapStateToProps = state => ({
  loginSession: state.auth.loginSession,
  customerEventList: state.home.customerEventList,
});

export default compose(
  connect(mapStateToProps, {
    fetchCustomerEventsAction: fetchCustomerEvents,
  }),
  withStyles(styles),
)(PrimarySearchAppBar);
