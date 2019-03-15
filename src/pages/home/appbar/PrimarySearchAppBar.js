import React from 'react';
import {
  objectOf, any, func, arrayOf, object, string,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Typography,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  AssignmentInd,
  Notifications as NotificationsIcon,
  Fingerprint,
} from '@material-ui/icons';
import { fetchCustomerEvents } from 'reduxModules/home.actions';
import logo from 'images/quezone-logo.png';
import EventMenu from './eventMenu/EventMenu';
import styles from './PrimarySearchAppBarStyle';

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEventEl: null,
  };

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

  handleOpenEventList = (event) => {
    this.setState({ anchorEventEl: event.currentTarget });
  };

  handleEventListClose = () => {
    this.setState({ anchorEventEl: null });
  };

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
  };

  handleOpenProfileDialog = () => {
    const { handleOpenProfile } = this.props;
    handleOpenProfile();
    this.handleEventListClose();
  };

  render() {
    const { anchorEventEl } = this.state;
    const {
      classes, loginSession, onSearch, customerEventList, onSearchValue,
      handleViewEvent,
    } = this.props;
    const currentTime = moment.now();
    const eventCount = customerEventList
      && customerEventList.filter(event => event.slot.startSec * 1000 > currentTime).length;
    const isEventListOpen = Boolean(anchorEventEl);
    const isAuthenticated = loginSession ? loginSession.isAuthenticated : false;

    const customUser = isAuthenticated ? (
      <>
        <Typography
          aria-haspopup="true"
          color="inherit"
          variant="subheading"
          className={`text-capitalize ${classes.desktopView}`}
        >
          Hello {loginSession.username}!
        </Typography>
        <IconButton color="inherit" onClick={this.handleOpenEventList}>
          <Badge badgeContent={eventCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
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
            onClick={() => this.handleAuthenticateUser('isLoginOpen')}
            className="hover-pointer hover-bright"
          >
            Sign In
          </Typography>
          <Fingerprint />
        </div>
        <div className={classes.mobileView}>
          <IconButton aria-haspopup="true" onClick={() => this.handleAuthenticateUser('isLoginOpen')} color="inherit">
            <Fingerprint />
          </IconButton>
        </div>
      </>
    );
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
              />
            </div>
            <div className={classes.grow} />
            { customUser }
          </Toolbar>
        </AppBar>
        <EventMenu
          eventList={customerEventList}
          isOpenList={isEventListOpen}
          handleCloseList={this.handleEventListClose}
          handleViewEvent={handleViewEvent}
        />
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
  handleViewEvent: func.isRequired,
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
