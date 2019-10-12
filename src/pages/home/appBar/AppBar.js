import React from 'react';
import { objectOf, any, func, string, bool } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { noop, get, compact } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Typography, Button } from '@material-ui/core';
import {
  Search as SearchIcon, AssignmentInd, Notifications as NotificationsIcon, Fingerprint, FindInPage, Assignment, Clear
} from '@material-ui/icons';
import { AUTHENTICATED_KEY, PROFILE, EVENT_STATUS } from 'utils/constants';
import { navigateTo } from 'utils/common';
import logo from 'images/quezone-logo.png';
import { appBarProps } from 'pages/commonProps';
import TrackingEvents from './TrackingEvents';
import styles from './AppBarStyle';

class MainAppBar extends React.Component {
  static propTypes = {
    enableSearch: bool.isRequired,
    maintenance: bool,
    onSearchValue: string,
    classes: objectOf(any).isRequired,
    loginSession: objectOf(any),
    handleAuthenticate: func.isRequired,
    onSearch: func.isRequired,
    onCloseSearch: func.isRequired,
    toggleAdvancedSearch: func.isRequired,
    dispatchGoToProfile: func.isRequired,
    dispatchTrackingEvent: func.isRequired,
    dispatchEventsByCustomerId: func.isRequired,
  };

  static defaultProps = {
    onSearchValue: '',
    loginSession: null,
    maintenance: false,
  };

  state = {
    eventList: [],
    eventListIds: [],
    loginSession: {},
    trackingAppointmentById: null,
    bookedEventId: '',
    isShowingTrackingList: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { eventList, loginSession, trackingAppointmentById, bookedEventId } = props;
    const {
      eventList: cachedEventList,
      loginSession: cachedLoginSession,
      trackingAppointmentById: cachedTrackingAppointmentById,
      bookedEventId: cachedBookedEventId,
    } = state;
    const updatedState = {};
    if (
      eventList !== null &&
      JSON.stringify(eventList) !== JSON.stringify(cachedEventList)
    ) {
      const eventListIds = eventList && eventList.length && eventList.map(item => item.id);
      updatedState.eventList = eventList;
      updatedState.eventListIds = eventListIds;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }
    if (
      trackingAppointmentById !== null &&
      JSON.stringify(trackingAppointmentById) !== JSON.stringify(cachedTrackingAppointmentById)
    ) {
      updatedState.trackingAppointmentById = trackingAppointmentById;
    }
    if (bookedEventId !== cachedBookedEventId) {
      updatedState.bookedEventId = bookedEventId;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const { dispatchEventsByCustomerId } = this.props;
    const { loginSession } = this.state;
    const customerId = get(loginSession, 'id');
    const authHeaders = get(loginSession, 'authHeaders');
    if (customerId) {
      dispatchEventsByCustomerId(customerId, authHeaders);
    }
  }

  componentDidUpdate(prevProps) {
    const { loginSession, bookedEventId } = prevProps;
    const {
      dispatchEventsByCustomerId, dispatchTrackingEvent,
    } = this.props;
    const {
      eventListIds: cachedEventListId, bookedEventId: cachedBookedEventId, loginSession: cachedLoginSession,
    } = this.state;
    const trackingLength = cachedEventListId && cachedEventListId.length;
    const cachedTrackingLength = cachedEventListId && cachedEventListId.length;

    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      const id = get(cachedLoginSession, 'id');
      const authHeaders = get(cachedLoginSession, 'authHeaders');
      if (id) {
        dispatchEventsByCustomerId(id, authHeaders);
      }
      if (
        trackingLength !== cachedTrackingLength
        && cachedEventListId
        && cachedEventListId.length > 0
      ) {
        dispatchTrackingEvent(cachedEventListId, authHeaders);
      }
      if (bookedEventId !== cachedBookedEventId) {
        dispatchEventsByCustomerId(id, authHeaders);
      }
    }
  }

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
  };

  handleActionAdvancedSearch = () => {
    const { toggleAdvancedSearch, enableSearch } = this.props;
    if (!enableSearch) {
      toggleAdvancedSearch(true)();
    }
  };

  navigatingProfile = page => () => {
    const { dispatchGoToProfile } = this.props;
    const { loginSession } = this.state;
    dispatchGoToProfile(page);
    navigateTo(`/profile/${loginSession.id}`)();
  };

  toggleTrackingList = () => {
    this.setState(oldState => ({
      isShowingTrackingList: !oldState.isShowingTrackingList,
    }));
  };

  handleRedirect = () => {
    navigateTo('/')();
  };

  render() {
    const { classes, onSearch, onSearchValue, maintenance, enableSearch, onCloseSearch } = this.props;
    const { eventList, loginSession, isShowingTrackingList, trackingAppointmentById } = this.state;
    const trackingList = [];
    if (eventList && eventList.length && trackingAppointmentById && compact(trackingAppointmentById).length) {
      eventList
        .map(event => trackingAppointmentById
          .map(tracking => (tracking && event.id === tracking.eventId ? trackingList.push({
            ...event,
            ...tracking,
          }) : null)));
    }
    const eventTracked = trackingList.filter(item => item && item.confirmedTime !== null);
    const currentTime = moment.now();
    const eventCount = eventList && eventList.length
      && eventList
        .filter(event => event.status !== EVENT_STATUS.CANCELED)
        .filter(event => moment(event.providerStartSec) > currentTime).length;
    const badgeStyle = eventCount > 0 ? 'text-margin-lr hover-pointer' : 'text-margin-lr';
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const [authLabel, openForm] = maintenance ? ['Sign Up', 'isRegisterOpen'] : ['Sign In', 'isLoginOpen'];
    const customUser = isAuthenticated ? (
      <>
        {isShowingTrackingList && (
          <TrackingEvents
            trackingList={eventTracked}
            onClose={this.toggleTrackingList}
          />
        )}
        <Typography
          aria-haspopup="true"
          color="inherit"
          variant="subheading"
          className={`text-capitalize text-margin-lr ${classes.desktopView}`}
        >
          Hello {loginSession.username}!
        </Typography>
        <Badge
          onClick={this.toggleTrackingList}
          badgeContent={eventTracked && eventTracked.length}
          color="secondary"
          className={badgeStyle}
        >
          <Assignment />
        </Badge>
        <Badge
          onClick={eventCount && eventCount > 0 ? this.navigatingProfile(PROFILE.PAGE.EVENT_LIST) : noop}
          badgeContent={eventCount}
          color="secondary"
          className={badgeStyle}
        >
          <NotificationsIcon />
        </Badge>
        <IconButton onClick={this.navigatingProfile(PROFILE.PAGE.EVENT_LIST)} color="inherit">
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
            className="hover-pointer hover-bright"
          >
            {authLabel}
          </Typography>
          <Fingerprint color="inherit" className="icon-normal" />
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
        <AppBar classes={{ root: 'z-index-high' }} position="fixed">
          <Toolbar className={`${classes.mainLinear}`}>
            <Avatar
              className={classes.avatar}
              imgProps={{
                className: classes.img,
              }}
              alt="Quezone Logo"
              src={logo}
              onClick={this.handleRedirect}
            />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Services"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={onSearch}
                value={onSearchValue}
                disabled={!enableSearch}
              />
              <div className={classes.clearSearch}>
                {onSearchValue && <Clear color="secondary" onClick={onCloseSearch} />}
              </div>
            </div>
            <Typography variant="subheading" className={adSearchStyle}>
              or
            </Typography>
            <div className="advanced-search-app-bar">
              <Button onClick={this.handleActionAdvancedSearch} className="simple-button">
                <FindInPage className={adSearchStyle} />
                <span className="advance-search-cta-label">
                  <Typography className={adSearchStyle} variant="body1">
                    Advanced search
                  </Typography>
                </span>
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

export default compose(
  connect(
    appBarProps.mapStateToProps,
    appBarProps.mapDispatchToProps
  ),
  withStyles(styles),
)(MainAppBar);
