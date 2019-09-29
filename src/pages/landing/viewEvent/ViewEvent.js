import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { IconButton, Button } from '@material-ui/core';
import Loading from 'components/Loading';
import MapDialog from 'components/Map/MapDialog';
import Error from 'components/Error';
import Success from 'components/Success';
import { navigateTo } from 'utils/common';
import Logo from 'images/quezone-logo.png';
import { Home, AssignmentInd, Clear } from '@material-ui/icons';
import { viewEventProps } from 'pages/commonProps';
import CustomModal from 'components/Modal/CustomModal';
import { EVENT_STATUS } from 'utils/constants';
import Event from './Event';
import s from './ViewEvent.module.scss';

class ViewEvent extends Component {
  static propTypes = {
    dispatchSetEventById: func.isRequired,
    dispatchCancelEvent: func.isRequired,
    dispatchClearCancelStatus: func.isRequired,
    match: objectOf(any).isRequired,
  };

  state = {
    eventById: {},
    userDetail: {},
    loginSession: {},
    isOpenMap: false,
    isCancelEventPopup: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { eventById, userDetail, loginSession } = props;
    const {
      eventById: cachedEventById, userDetail: cachedUserDetail, loginSession: cachedLoginSession,
    } = state;
    const updatedState = {};
    if (
      eventById !== null &&
      JSON.stringify(eventById) !== JSON.stringify(cachedEventById)
    ) {
      updatedState.eventById = eventById;
    }
    if (userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const {
      dispatchSetEventById,
      match: { params: { id } },
    } = this.props;

    dispatchSetEventById(id);
  }

  handleRedirect = () => {
    const { dispatchClearCancelStatus } = this.props;
    dispatchClearCancelStatus();
    navigateTo('/')();
  };

  handleViewProfile = id => () => {
    navigateTo(`/profile/${id}`)();
  };

  handleToggleMap = () => {
    this.setState(oldState => ({
      isOpenMap: !oldState.isOpenMap,
    }));
  };

  handleCancelEvent = (id, headers) => () => {
    const { dispatchCancelEvent } = this.props;
    dispatchCancelEvent(id, headers);
    this.toggleConfirmCancelEvent();
  };

  toggleConfirmCancelEvent = () => {
    this.setState(oldState => ({
      isCancelEventPopup: !oldState.isCancelEventPopup,
    }));
  };

  render() {
    const { eventById, userDetail, isOpenMap, isCancelEventPopup, loginSession } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const headers = get(loginSession, 'authHeaders');
    const eventId = get(eventById, 'id');
    const sName = get(eventById, 'serviceName', '');
    const fullAddress = get(eventById, 'fullAddress');
    const bookingCode = get(eventById, 'bookingCode');
    const status = get(eventById, 'status');
    const coordinates = get(eventById, 'coordinates');
    const mapData = {
      coordinates,
      fullAddress,
    };
    const [title, titleStyle] = status === EVENT_STATUS.CANCELED
      ? [`Oops! Your reservation has been ${status}`, s.cancelledEvent]
      : ['Congratulations! Your reservation request has been confirmed!', s.confirmEvent];
    const isCancellable = !!userId && status !== EVENT_STATUS.CANCELED;

    return (
      <>
        <CustomModal
          type="info"
          title="Cancel Event"
          isOpen={isCancelEventPopup}
          message="Are you sure to cancel this event?"
          isBackDropClickDisabled
          cancelCallBack={this.toggleConfirmCancelEvent}
          okCallBack={this.handleCancelEvent(eventId, headers)}
        />
        <MapDialog toggle={this.handleToggleMap} serviceName={sName} isOpen={isOpenMap} geoLocation={mapData} />
        <Loading />
        <Error resetOtherStatus={this.handleRedirect} />
        <Success userCallback={this.handleRedirect}/>
        <div className={s.container}>
          <div className={s.navBar}>
            <div className={s.logo}>
              <img src={Logo} alt="Quezone Logo" width="100%" height="100%" />
            </div>
            <div className={s.rightCta}>
              <IconButton className="simple-button white-color" onClick={this.handleRedirect}>
                <Home color="inherit" />
              </IconButton>
              {userId && (
                <IconButton className="simple-button white-color" onClick={this.handleViewProfile(userId)}>
                  <AssignmentInd color="inherit" />
                </IconButton>
              )}
            </div>
          </div>
          {eventId && (
            <div className={s.content}>
              <div className={`${s.title} ${titleStyle}`}>
                {title}
              </div>
              <div className={s.information}>
                <div className={s.bookingCode}>
                  Reservation reference code <strong>{bookingCode}</strong>
                </div>
                <Event appointment={eventById} viewMap={this.handleToggleMap}/>
                {isCancellable && (
                  <div className={s.cta}>
                    <Button variant="outlined" color="inherit" onClick={this.toggleConfirmCancelEvent}>
                      <Clear color="inherit" />
                      <span>&nbsp;Cancel</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default connect(
  viewEventProps.mapStateToProps,
  viewEventProps.mapDispatchToProps,
)(ViewEvent);
