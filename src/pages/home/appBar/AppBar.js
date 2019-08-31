import React from 'react';
import {
  objectOf,
  any,
  func,
  string,
  bool,
} from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import {
  noop,
  get,
  compact,
} from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  AssignmentInd,
  Notifications as NotificationsIcon,
  Fingerprint,
  FindInPage,
  Assignment,
} from '@material-ui/icons';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { trackingAppointmentByIdsAction } from 'actionsReducers/customer.actions';
import { history } from 'containers/App';
import {
  AUTHENTICATED_KEY,
  PROFILE,
} from 'utils/constants';
import logo from 'images/quezone-logo.png';
import { goProfilePage } from 'actionsReducers/profile.actions';
import { EVENT_STATUS } from '../../profile/appointmentDialog/Appointment.constants';
import TrackingEvents from './TrackingEvents';
import styles from './AppBarStyle';

class MainAppBar extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList,
      loginSession,
      trackingAppointmentById,
      appointmentEvent,
    } = props;
    const {
      eventList: cachedEventList,
      loginSession: cachedLoginSession,
      trackingAppointmentById: cachedTrackingAppointmentById,
      appointmentEvent: cachedAppointmentEvent,
    } = state;
    if (
      eventList !== cachedEventList
      || loginSession !== cachedLoginSession
      || trackingAppointmentById !== cachedTrackingAppointmentById
      || appointmentEvent !== cachedAppointmentEvent
    ) {
      const eventListIds = eventList && eventList.length && eventList.map(item => item.id);

      return {
        eventList,
        loginSession,
        eventListIds,
        trackingAppointmentById: compact(trackingAppointmentById),
        appointmentEvent,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
      eventListIds: null,
      loginSession: null,
      trackingAppointmentById: null,
      isShowingTrackingList: false,
      appointmentEvent: null,
    };
  }

  componentDidMount() {
    const {
      loginSession,
      findEventByCustomerIdAction: findEventByCustomerId,
    } = this.props;
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const customerId = get(loginSession, 'id');
    const authHeaders = get(loginSession, 'authHeaders');
    if (isAuthenticated && customerId) {
      findEventByCustomerId(customerId, authHeaders);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      loginSession,
      appointmentEvent,
    } = prevProps;
    const {
      loginSession: updatedLoginSession,
      findEventByCustomerIdAction: findEventByCustomerId,
      trackingAppointmentByIdsAction: trackingAppointmentByIds,
    } = this.props;
    const {
      eventListIds,
    } = prevState;
    const {
      eventListIds: cachedEventListId,
      appointmentEvent: cachedAppointmentEvent,
    } = this.state;

    const trackingLength = eventListIds && eventListIds.length;
    const cachedTrackingLength = cachedEventListId && cachedEventListId.length;

    if (
      loginSession !== updatedLoginSession
    ) {
      const id = get(updatedLoginSession, 'id');
      const authHeaders = get(updatedLoginSession, 'authHeaders');
      if (id) {
        findEventByCustomerId(id, authHeaders);
      }
      if (
        trackingLength !== cachedTrackingLength
        && cachedEventListId
        && cachedEventListId.length > 0
      ) {
        trackingAppointmentByIds(cachedEventListId, authHeaders);
      }
      if (appointmentEvent && cachedAppointmentEvent && appointmentEvent.id !== cachedAppointmentEvent.id) {
        findEventByCustomerId(id, authHeaders);
      }
    }
  }

  handleAuthenticateUser = (authenticateType) => {
    const { handleAuthenticate } = this.props;
    handleAuthenticate(authenticateType);
  };

  handleActionAdvancedSearch = () => {
    const { handleAdvancedSearch, maintenance } = this.props;
    if (!maintenance) {
      handleAdvancedSearch();
    }
  };

  navigatingProfile = page => () => {
    const { goProfilePage: goProfilePageAction } = this.props;
    const { loginSession } = this.state;
    goProfilePageAction(page);
    history.push(`/profile/${loginSession.id}`);
  };

  toggleTrackingList = () => {
    this.setState(oldState => ({
      isShowingTrackingList: !oldState.isShowingTrackingList,
    }));
  };

  render() {
    const {
      classes,
      onSearch,
      onSearchValue,
      maintenance,
    } = this.props;
    const {
      eventList,
      loginSession,
      isShowingTrackingList,
      trackingAppointmentById,
    } = this.state;
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

MainAppBar.propTypes = {
  classes: objectOf(any).isRequired,
  handleAuthenticate: func.isRequired,
  onSearch: func.isRequired,
  loginSession: objectOf(any),
  findEventByCustomerIdAction: func.isRequired,
  onSearchValue: string,
  handleAdvancedSearch: func.isRequired,
  maintenance: bool.isRequired,
  goProfilePage: func.isRequired,
  trackingAppointmentByIdsAction: func.isRequired,
};

MainAppBar.defaultProps = {
  onSearchValue: '',
  loginSession: null,
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.auth,
  ...state.home,
  ...state.booking,
  ...state.customer,
});

export default compose(
  connect(mapStateToProps, {
    findEventByCustomerIdAction,
    goProfilePage,
    trackingAppointmentByIdsAction,
  }),
  withStyles(styles),
)(MainAppBar);
