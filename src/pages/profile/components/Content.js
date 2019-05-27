import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  Event,
  Settings,
  ExitToApp,
  AddToQueue,
  Assessment,
} from '@material-ui/icons';
import { logout } from 'authentication/actions/logout';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { cancelEventById } from 'actionsReducers/profile.actions';
import { PROFILE } from 'utils/constants';
import WaitList from './WaitList';
import Info from './Info';
import Survey from './Survey';
import EventList from '../appointmentDialog/Appointment';
import s from './Content.module.scss';

class Content extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList,
      profilePage,
      cancelEventByIdStatus,
      waitLists,
    } = props;
    const {
      eventList: cachedEventList,
      profilePage: cachedProfilePage,
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
      waitLists: cachedWaitLists,
    } = state;
    if (
      eventList !== cachedEventList
      || (profilePage && profilePage !== cachedProfilePage)
      || cancelEventByIdStatus !== cachedCancelEventByIdStatus
      || waitLists !== cachedWaitLists
    ) {
      return {
        eventList,
        profilePage,
        cancelEventByIdStatus,
        waitLists,
      };
    }
    return null;
  }

  SIDE_PANEL = [
    {
      name: PROFILE.PAGE.WAIT_LIST, icon: AddToQueue, text: 'My waiting list', isSelected: false,
    },
    {
      name: PROFILE.PAGE.EVENT_LIST, icon: Event, text: 'My event list', isSelected: false,
    },
    {
      name: PROFILE.PAGE.SURVEY, icon: Assessment, text: 'My assessment list', isSelected: false,
    },
    {
      name: PROFILE.PAGE.MY_INFO, icon: Settings, text: 'My information', isSelected: false,
    },
    {
      name: 'signOut',
      icon: ExitToApp,
      text: 'Sign out',
      isSelected: false,
      func: () => this.handleSignOut(),
    },
  ];

  initState = this.SIDE_PANEL.reduce((initItems, item) => ({
    ...initItems,
    [item.name]: item.isSelected,
  }), {});

  constructor(props) {
    super(props);
    this.state = {
      eventList: null,
      waitLists: null,
      sidePanel: { ...this.initState },
    };
  }

  componentDidMount() {
    const { profilePage } = this.props;
    this.setState({ sidePanel: { [profilePage]: true } });
  }

  componentDidUpdate(prevProps) {
    const {
      findEventByCustomerIdAction: findEventByCustomerId,
      cancelEventById: cancelEventByIdAction,
      customerId,
    } = this.props;
    const {
      cancelEventByIdStatus,
    } = prevProps;
    const {
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
    } = this.state;
    if (cancelEventByIdStatus !== cachedCancelEventByIdStatus && cachedCancelEventByIdStatus === 200) {
      findEventByCustomerId(customerId);
      cancelEventByIdAction(null);
    }
  }

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

  renderItems = () => {
    const {
      eventList,
      waitLists,
    } = this.state;

    return this.SIDE_PANEL.map((panel) => {
      const { sidePanel } = this.state;
      const onClick = this.handleSelectSideMenu(panel);
      const className = sidePanel[panel.name]
        ? `${s.item} ${s.selected}` : s.item;
      const props = {
        onClick,
        className,
      };
      return (
        <div {...props} key={panel.name}>
          <panel.icon className="main-color qz-icon-padding-small" />
          <div className={s.itemCount}>
            <Typography variant="subheading" color="inherit">
              {panel.text}
            </Typography>
            <Typography variant="subheading" color="inherit">
              {panel.name === PROFILE.PAGE.EVENT_LIST ? `(${(eventList && eventList.length) || 0})` : null}
              {panel.name === PROFILE.PAGE.WAIT_LIST ? `(${(waitLists && waitLists.length) || 0})` : null}
            </Typography>
          </div>
        </div>
      );
    });
  };

  render() {
    const {
      givenName,
      handleAccount,
      updateProfileStatus,
      customerId,
    } = this.props;
    const {
      sidePanel: {
        eventList,
        myInfo,
        waitList,
        surveyList,
      },
      eventList: cachedEventList,
    } = this.state;
    return (
      <div className={s.content}>
        <div className={s.sidebar}>
          <div>
            <Typography variant="subtitle1" color="primary" className={`${s.title} text-capitalize`}>
              Hi {givenName}!
            </Typography>
          </div>
          <div className={s.cta}>
            {this.renderItems()}
          </div>
        </div>
        {
          waitList && (
            <div className={s.profilePage}>
              <WaitList customerId={customerId} />
            </div>
          )
        }
        {eventList && (
          <div className={s.profilePage}>
            <EventList customerId={customerId} eventList={cachedEventList} />
          </div>)
        }
        {myInfo && (
          <div className={s.profilePage}>
            <Info handleAccount={handleAccount} updateProfileStatus={updateProfileStatus} />
          </div>)
        }
        {surveyList && (
          <div className={s.profilePage}>
            <Survey customerId={customerId} eventList={cachedEventList} />
          </div>)
        }
      </div>
    );
  }
}

Content.propTypes = {
  customerId: string.isRequired,
  onClose: func.isRequired,
  givenName: string,
  logoutAction: func.isRequired,
  handleAccount: func.isRequired,
  updateProfileStatus: string.isRequired,
  profilePage: string.isRequired,
  findEventByCustomerIdAction: func.isRequired,
  cancelEventById: func.isRequired,
};

Content.defaultProps = {
  givenName: '',
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.profile,
  ...state.waitLists,
});

export default connect(mapStateToProps, {
  logoutAction: logout,
  findEventByCustomerIdAction,
  cancelEventById,
})(Content);
