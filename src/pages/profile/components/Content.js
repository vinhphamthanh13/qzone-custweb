import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  Event,
  Settings,
  ExitToApp,
  AddToQueue,
} from '@material-ui/icons';
import { logout } from 'authentication/actions/logout';
import EventList from 'pages/profile/appointmentDialog/Appointment';
import WaitList from './WaitList';
import Info from './Info';
import s from './Content.module.scss';

const EVENT_LIST = 'eventList';
const MY_INFO = 'myInfo';
const WAIT_LIST = 'waitList';

class Content extends Component {
  static getDerivedStateFromProps(props, state) {
    const {
      eventList,
    } = props;
    const {
      eventList: cachedEventList,
    } = state;
    if (eventList !== cachedEventList) {
      return {
        eventList,
      };
    }
    return null;
  }

  SIDE_PANEL = [
    {
      name: WAIT_LIST, icon: AddToQueue, text: 'My waiting list', isSelected: false,
    },
    {
      name: EVENT_LIST, icon: Event, text: 'My event list', isSelected: false,
    },
    {
      name: MY_INFO, icon: Settings, text: 'My information', isSelected: false,
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
      sidePanel: { ...this.initState },
    };
  }

  componentDidMount() {
    this.setState({ sidePanel: { [EVENT_LIST]: true } });
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
    const { eventList } = this.state;

    return this.SIDE_PANEL.map((panel) => {
      const { sidePanel } = this.state;
      const onClick = this.handleSelectSideMenu(panel);
      const [className, textColor] = sidePanel[panel.name]
        ? [`${s.item} ${s.selected}`, 'textPrimary'] : [`${s.item}`, 'textSecondary'];
      const props = {
        onClick,
        className,
      };
      return (
        <div {...props} key={panel.name}>
          <panel.icon className="main-color qz-icon-padding-small" />
          <Typography variant="subheading" color={textColor}>
            {panel.text}{' '}
            {panel.name === EVENT_LIST ? `(${(eventList && eventList.length) || 0})` : null}
          </Typography>
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
        waitlist,
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
          waitlist && (
            <div className={s.profilePage}>
              <WaitList />
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
      </div>
    );
  }
}

Content.propTypes = {
  customerId: string.isRequired,
  onClose: func.isRequired,
  givenName: string.isRequired,
  logoutAction: func.isRequired,
  handleAccount: func.isRequired,
  updateProfileStatus: string.isRequired,
};

const mapStateToProps = state => ({
  ...state.common,
});

export default connect(mapStateToProps, {
  logoutAction: logout,
})(Content);
