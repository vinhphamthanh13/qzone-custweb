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
import uuidv1 from 'uuid/v1';
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
  Cancel,
} from '@material-ui/icons';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { trackingAppointmentByIdsAction } from 'actionsReducers/customer.actions';
import { history } from 'containers/App';
import {
  AUTHENTICATED_KEY,
  PROFILE,
  defaultDateFormat,
  timeSlotFormat,
} from 'utils/constants';
import logo from 'images/quezone-logo.png';
import { goProfilePage } from 'actionsReducers/profile.actions';
import styles from './AppBarStyle';

class MainAppBar extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList,
      loginSession,
      trackingAppointmentById,
    } = props;
    const {
      eventList: cachedEventList,
      loginSession: cachedLoginSession,
      trackingAppointmentById: cachedTrackingAppointmentById,
    } = state;
    if (
      eventList !== cachedEventList
      || loginSession !== cachedLoginSession
      || trackingAppointmentById !== cachedTrackingAppointmentById
    ) {
      const eventListIds = eventList && eventList.map(item => item.id);
      const trackingCount = [];
      if (eventList && eventList.length && trackingAppointmentById && compact(trackingAppointmentById).length) {
        eventList
          .map(event => trackingAppointmentById
            .map(tracking => (tracking && event.id === tracking.eventId ? trackingCount.push({
              ...event,
              ...tracking,
            }) : null)));
      }

      return {
        eventList,
        loginSession,
        eventListIds,
        trackingAppointmentById: compact(trackingAppointmentById),
        trackingCount: trackingCount.filter(item => item && item.confirmedTime !== null),
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
      trackingCount: [],
      // trackingAppointmentById: null,
      isShowingTrackingList: false,
    };
  }

  componentDidMount() {
    const {
      loginSession,
      findEventByCustomerIdAction: findEventByCustomerId,
    } = this.props;
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const customerId = get(loginSession, 'id');
    if (isAuthenticated && customerId) {
      findEventByCustomerId(customerId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      loginSession,
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
    } = this.state;

    const trackingLength = eventListIds && eventListIds.length;
    const cachedTrackingLength = cachedEventListId && cachedEventListId.length;

    if (
      loginSession !== updatedLoginSession
    ) {
      const id = get(updatedLoginSession, 'id');
      if (id) {
        findEventByCustomerId(updatedLoginSession.id);
      }
    }

    if (trackingLength !== cachedTrackingLength) {
      trackingAppointmentByIds(cachedEventListId);
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
      trackingCount,
      isShowingTrackingList,
    } = this.state;
    console.log('tracking count ', trackingCount);
    const currentTime = moment.now();
    const eventCount = eventList
      && eventList.filter(event => moment(event.startSec * 1000) > currentTime).length;
    const badgeStyle = eventCount > 0 ? 'text-margin-lr hover-pointer' : 'text-margin-lr';
    const isAuthenticated = get(loginSession, AUTHENTICATED_KEY);
    const [authLabel, openForm] = maintenance ? ['Sign Up', 'isRegisterOpen'] : ['Sign In', 'isLoginOpen'];
    const customUser = isAuthenticated ? (
      <>
        {isShowingTrackingList && (
          <div className="trackingList">
            <div className="trackingContent">
              <div className="trackingTitle">
                <Typography variant="title" color="inherit" className="text-bold">
                  Tracking Events
                </Typography>
                <IconButton onClick={this.toggleTrackingList}>
                  <Cancel color="inherit" className="icon-big" />
                </IconButton>
              </div>
              {trackingCount.sort((a, b) => a.checkedInTime - b.checkedInTime).map(item => (
                <div key={uuidv1()} className="trackingItem">
                  <div className="trackingItemTitle">
                    <Typography variant="subheading" color="inherit" className="text-bold">
                      {item.serviceName}
                    </Typography>
                  </div>
                  <div className="trackingItemContent">
                    <Typography variant="body1" color="inherit">
                      Start: {moment(item.checkedInTime * 1000).format(`${defaultDateFormat} - ${timeSlotFormat}`)}
                    </Typography>
                    <Typography variant="body1" color="inherit">
                      End: {moment(item.completedTime * 1000).format(`${defaultDateFormat} - ${timeSlotFormat}`)}
                    </Typography>
                    <Typography variant="body1" color="inherit" className="text-bold">
                      Confirmed at: {moment(item.confirmedTime * 1000)
                      .format(`${defaultDateFormat} - ${timeSlotFormat}`)}
                    </Typography>
                    <div className="trackingItemStatus">
                      <Typography variant="subheading" className="text-bold">
                        Status: {item.status}
                      </Typography>
                    </div>
                  </div>
                </div>))
              }
            </div>
          </div>
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
          badgeContent={trackingCount && trackingCount.length}
          color="secondary"
          className={badgeStyle}
        >
          <Assignment />
        </Badge>
        <Badge
          onClick={eventCount > 0 ? this.navigatingProfile(PROFILE.PAGE.EVENT_LIST) : noop}
          badgeContent={eventCount}
          color="secondary"
          className={badgeStyle}
        >
          <NotificationsIcon />
        </Badge>
        <IconButton onClick={this.navigatingProfile(PROFILE.PAGE.WAIT_LIST)} color="inherit">
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
