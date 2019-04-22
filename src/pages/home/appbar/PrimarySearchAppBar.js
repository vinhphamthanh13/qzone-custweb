import React from 'react';
import {
  objectOf, any, func, string, bool,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { noop, get } from 'lodash';
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
import { findEventByCustomerIdAction } from 'actionsReducers/home.actions';
import logo from 'images/quezone-logo.png';
import styles from './PrimarySearchAppBarStyle';

class PrimarySearchAppBar extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList,
      loginSession,
    } = props;
    const {
      eventList: cachedEventList,
      loginSession: cachedLoginSession,
    } = state;
    console.log('props', props);
    console.log('state', state);
    const authenticated = get(loginSession, 'isAuthenticated');
    const cachedAuthenticated = get(cachedLoginSession, 'isAuthenticated');
    if (
      eventList !== cachedEventList
      || authenticated !== cachedAuthenticated
    ) {
      return {
        eventList,
        loginSession,
      };
    }
    return null;
  }

  state = {
    eventList: null,
  };

  componentDidMount() {
    const {
      loginSession,
      findEventByCustomerIdAction: findEventByCustomerId,
    } = this.props;
    const [isAuthenticated, id] = loginSession
      ? [loginSession.isAuthenticated, loginSession.id] : [false, ''];
    if (isAuthenticated) {
      findEventByCustomerId(id);
    }
  }

  componentDidUpdate(prevProps) {
    const { loginSession } = prevProps;
    const {
      loginSession: updatedLoginSession,
      findEventByCustomerIdAction: findEventByCustomerId,
    } = this.props;
    if (loginSession.isAuthenticated !== updatedLoginSession.isAuthenticated) {
      findEventByCustomerId(updatedLoginSession.id);
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
      classes, loginSession, onSearch, onSearchValue, maintenance,
    } = this.props;
    const { eventList } = this.state;
    const currentTime = moment.now();
    const eventCount = eventList
      && eventList.filter(event => event.slot.startSec * 1000 > currentTime).length;
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
  findEventByCustomerIdAction: func.isRequired,
  handleOpenProfile: func.isRequired,
  onSearchValue: string,
  handleAdvancedSearch: func.isRequired,
  maintenance: bool.isRequired,
};

PrimarySearchAppBar.defaultProps = {
  onSearchValue: '',
};

const mapStateToProps = state => ({
  loginSession: state.auth.loginSession,
  ...state.home,
});

export default compose(
  connect(mapStateToProps, {
    findEventByCustomerIdAction,
  }),
  withStyles(styles),
)(PrimarySearchAppBar);
