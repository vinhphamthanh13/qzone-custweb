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
    console.log('get derived from props content', props);
    console.log('get derived from state content', state);
    const {
      eventList,
      profilePage,
      cancelEventByIdStatus,
    } = props;
    const {
      eventList: cachedEventList,
      profilePage: cachedProfilePage,
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
    } = state;
    if (
      eventList !== cachedEventList
      || (profilePage && profilePage !== cachedProfilePage)
      || cancelEventByIdStatus !== cachedCancelEventByIdStatus
    ) {
      return {
        eventList,
        profilePage,
        cancelEventByIdStatus,
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
    console.log('compoinente did  update ', prevProps);
    console.log('compoinente did  update state', this.state);
    if (cancelEventByIdStatus !== cachedCancelEventByIdStatus && cancelEventByIdStatus === 200) {
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
            {panel.name === PROFILE.PAGE.EVENT_LIST ? `(${(eventList && eventList.length) || 0})` : null}
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
});

export default connect(mapStateToProps, {
  logoutAction: logout,
  findEventByCustomerIdAction,
  cancelEventById,
})(Content);
