import React, { Component } from 'react';
import { func, objectOf, any } from 'prop-types';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import Loading from 'components/Loading';
import MapDialog from 'components/Map/MapDialog';
import Error from 'components/Error';
import { navigateTo } from 'utils/common';
import Logo from 'images/quezone-logo.png';
import { Home, AssignmentInd } from '@material-ui/icons';
import { viewEventProps } from 'pages/commonProps';
import { EVENT_STATUS } from 'utils/constants';
import Event from './Event';
import s from './ViewEvent.module.scss';

class ViewEvent extends Component {
  static propTypes = {
    dispatchSetEventById: func.isRequired,
    match: objectOf(any).isRequired,
  };

  state = {
    eventById: {},
    userDetail: {},
    isOpenMap: false,
  };

  static getDerivedStateFromProps(props, state) {
    const { eventById, userDetail } = props;
    const { eventById: cachedEventById, userDetail: cachedUserDetail } = state;
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

  render() {
    const { eventById, userDetail, isOpenMap } = this.state;
    const userId = get(userDetail, 'userSub') || get(userDetail, 'id');
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

    return (
      <>
        <MapDialog toggle={this.handleToggleMap} serviceName={sName} isOpen={isOpenMap} geoLocation={mapData} />
        <Loading />
        <Error resetOtherStatus={this.handleRedirect} />
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
