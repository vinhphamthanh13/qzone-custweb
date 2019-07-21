import React, { Component } from 'react';
import { string, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import { find, uniqBy } from 'lodash';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import {
  Event,
  Settings,
  ExitToApp,
  AddToQueue,
  Assessment,
} from '@material-ui/icons';
import { findEventByCustomerIdAction } from 'actionsReducers/common.actions';
import { cancelEventById } from 'actionsReducers/profile.actions';
import { trackingAppointmentByIdsAction } from 'actionsReducers/customer.actions';
import { setBookingStep } from 'actionsReducers/booking.actions';
import {
  setSurveys,
  setAssessmentAction,
} from 'actionsReducers/surveys.action';
import { PROFILE, BOOKING } from 'utils/constants';
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
      surveyList,
      customerAssessment,
    } = props;
    const {
      eventList: cachedEventList,
      profilePage: cachedProfilePage,
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
      waitLists: cachedWaitLists,
      surveyList: cachedSurveyList,
      customerAssessment: cachedCustomerAssessment,
    } = state;
    if (
      eventList !== cachedEventList
      || (profilePage && profilePage !== cachedProfilePage)
      || cancelEventByIdStatus !== cachedCancelEventByIdStatus
      || waitLists !== cachedWaitLists
      || surveyList !== cachedSurveyList
      || customerAssessment !== cachedCustomerAssessment
    ) {
      const eventListIds = eventList && eventList.length && eventList.map(item => item.id);

      return {
        eventList,
        eventListIds,
        profilePage,
        cancelEventByIdStatus,
        waitLists,
        surveyList,
        customerAssessment,
      };
    }
    return null;
  }

  SIDE_PANEL = [
    {
      name: PROFILE.PAGE.WAIT_LIST,
      icon: AddToQueue,
      text: 'My waiting list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.EVENT_LIST,
      icon: Event,
      text: 'My event list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.SURVEY,
      icon: Assessment,
      text: 'My assessment list',
      isSelected: false,
    },
    {
      name: PROFILE.PAGE.MY_INFO,
      icon: Settings,
      text: 'My information',
      isSelected: false,
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
      surveyList: null,
      sidePanel: { ...this.initState },
    };
  }

  componentDidMount() {
    const {
      profilePage,
      setSurveys: setSurveyAction,
    } = this.props;

    setSurveyAction();
    this.setState({ sidePanel: { [profilePage]: true } });
  }

  componentDidUpdate(prevProps) {
    const {
      cancelEventByIdStatus,
      setAssessmentAction: setAssessments,
      eventList,
    } = prevProps;
    const {
      findEventByCustomerIdAction: findEventByCustomerId,
      cancelEventById: cancelEventByIdAction,
      customerId,
      eventList: cachedEventList,
      trackingAppointmentByIdsAction: trackingAppointmentByIds,
      customerAssessment,
    } = this.props;
    const {
      cancelEventByIdStatus: cachedCancelEventByIdStatus,
      eventListIds,
      surveyList,
    } = this.state;

    const trackingList = eventList && eventList.length;
    const cachedTrackingList = cachedEventList && cachedEventList.length;

    if (cancelEventByIdStatus !== cachedCancelEventByIdStatus && cachedCancelEventByIdStatus === 200) {
      findEventByCustomerId(customerId);
      cancelEventByIdAction(null);
    }

    if (trackingList !== cachedTrackingList && eventListIds.length > 0) {
      trackingAppointmentByIds(eventListIds);
    }
    const surveys = [];
    // eslint-disable-next-line
    eventList && eventList.length && eventList.map((event) => {
      const targetSurvey = find(surveyList, survey => survey.tempServiceId === event.tempServiceId);
      if (targetSurvey) surveys.push(targetSurvey);
      return event;
    });
    if (surveys.length !== customerAssessment.length) {
      setAssessments(surveys);
    }
  }

  handleSignOut = () => {
    const {
      onClose,
      handleLogout,
      setBookingStep: setBookingStepAction,
    } = this.props;
    onClose();
    handleLogout();
    setBookingStepAction(BOOKING.STEPS.SELECT_PROVIDER);
  };

  handleSelectSideMenu = panel => (event) => {
    const { handleSidePanel } = this.props;
    event.preventDefault();
    handleSidePanel();
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
      customerAssessment,
    } = this.state;

    const assessmentCount = customerAssessment && uniqBy(customerAssessment, 'id').length;
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
              {panel.name === PROFILE.PAGE.EVENT_LIST ? eventList && eventList.length : null}
              {panel.name === PROFILE.PAGE.WAIT_LIST ? waitLists && waitLists.length : null}
              {panel.name === PROFILE.PAGE.SURVEY ? assessmentCount : null}
            </Typography>
          </div>
        </div>
      );
    });
  };

  greetingText = () => {
    const hour = moment().hour();
    if (hour >= 12 && hour <= 17) {
      return 'Good afternoon!';
    }
    if (hour >= 18) {
      return 'Good evening!';
    }
    return 'Good morning!';
  };

  render() {
    const {
      handleAccount,
      updateProfileStatus,
      customerId,
      toggleSidePanel,
      handleSidePanel,
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
        {toggleSidePanel && (
          // eslint-disable-next-line
          <div className={s.sidebarOverlay} onClick={() => handleSidePanel(false)}>
            <div className={s.sidebar}>
              <div>
                <Typography variant="subtitle1" color="primary" className={`${s.title} text-capitalize`}>
                  {this.greetingText()}
                </Typography>
              </div>
              <div className={s.cta}>
                {this.renderItems()}
              </div>
            </div>
          </div>
        )}
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
  handleAccount: func.isRequired,
  updateProfileStatus: string.isRequired,
  profilePage: string.isRequired,
  findEventByCustomerIdAction: func.isRequired,
  cancelEventById: func.isRequired,
  trackingAppointmentByIdsAction: func.isRequired,
  handleLogout: func.isRequired,
  setBookingStep: func.isRequired,
  toggleSidePanel: bool.isRequired,
  handleSidePanel: func.isRequired,
};

Content.defaultProps = {
  givenName: '',
};

const mapStateToProps = state => ({
  ...state.common,
  ...state.profile,
  ...state.waitLists,
  ...state.surveys,
});

export default connect(mapStateToProps, {
  findEventByCustomerIdAction,
  cancelEventById,
  trackingAppointmentByIdsAction,
  setSurveys,
  setAssessmentAction,
  setBookingStep,
})(Content);
