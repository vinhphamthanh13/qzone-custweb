import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { IconButton, Button } from '@material-ui/core';
import { CheckCircle, NavigateBefore } from '@material-ui/icons';
import Auth from 'pages/Auth';
import { navigateTo } from 'utils/common';
import Loading from 'components/Loading';
import Error from 'components/Error';
import CustomModal from 'components/Modal/CustomModal';
import ProviderInfo from './ProviderInfo';
import ClientInfo from './ClientInfo';
import { bookingProps } from '../../commonProps';
import s from './Booking.module.scss';

class Booking extends Component {
  static propTypes = {
    dispatchBookEvent: func.isRequired,
    dispatchConfirmWaitLists: func.isRequired,
  };

  static defaultProps = {
  };

  state = {
    isRegisterOpen: false,
    isLoginOpen: false,
    userDetail: {},
    userDetailById: {},
    confirmBooking: false,
    loginSession: {},
    bookedEventDetail: {},
    selectedBookingDetail: {},
  };

  recaptcha = React.createRef();

  static getDerivedStateFromProps(props, state) {
    const {
      selectedBookingDetail, userDetail, userDetailById, loginSession, bookedEventDetail, landingPageFactors,
    } = props;
    const {
      selectedBookingDetail: cachedBookingDetail, userDetail: cachedUserDetail, userDetail: cachedUserDetailById,
      loginSession: cachedLoginSession, bookedEventDetail: cachedBookedEventDetail,
      landingPageFactors: cachedLandingPageFactors,
    } = state;
    const updatedState = {};
    if (
      selectedBookingDetail !== null &&
      JSON.stringify(selectedBookingDetail) !== JSON.stringify(cachedBookingDetail)
    ) {
      updatedState.selectedBookingDetail = selectedBookingDetail;
    }
    if (
      userDetail !== null &&
      JSON.stringify(userDetail) !== JSON.stringify(cachedUserDetail)
    ) {
      updatedState.userDetail = userDetail;
    }
    if (
      userDetailById !== null &&
      JSON.stringify(userDetailById) !== JSON.stringify(cachedUserDetailById)
    ) {
      updatedState.userDetailById = userDetailById;
    }
    if (
      loginSession !== null &&
      JSON.stringify(loginSession) !== JSON.stringify(cachedLoginSession)
    ) {
      updatedState.loginSession = loginSession;
    }
    if (
      bookedEventDetail !== null &&
      JSON.stringify(bookedEventDetail) !== JSON.stringify(cachedBookedEventDetail)
    ) {
      updatedState.bookedEventDetail = bookedEventDetail;
    }
    if (
      landingPageFactors !== null &&
      JSON.stringify(landingPageFactors) !== JSON.stringify(cachedLandingPageFactors)
    ) {
      updatedState.landingPageFactors = landingPageFactors;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidUpdate(prevProps) {
    const { bookedEventDetail } = prevProps;
    const { bookedEventDetail: cachedBookedEventDetail, selectedBookingDetail } = this.state;
    if (!selectedBookingDetail || isEmpty(selectedBookingDetail)) {
      navigateTo('/')();
    }
    if (
      bookedEventDetail !== null &&
      JSON.stringify(bookedEventDetail) !== JSON.stringify(cachedBookedEventDetail)
    ) {
      const bookedEventId = get(cachedBookedEventDetail, 'id');
      if (bookedEventId) {
        navigateTo(`/event/${bookedEventId}`)();
      }
    }
  }

  handleSelectProvider = sId => () => {
    const { landingPageFactors } = this.state;
    const instantBooking = get(landingPageFactors, 'instantBooking');
    if (instantBooking) {
      const tId = get(landingPageFactors, 'tId');
      navigateTo(`/booking/instant/${tId}`)();
    } else {
      navigateTo(`/provider-by-service/${sId}`)();
    }
  };

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  handleOpenLogin = () => {
    this.openAuthModal('isLoginOpen');
  };

  closeDialog = (key) => {
    this.setState({ [key]: false });
  };

  handleRegisterEvent = () => {
    const { dispatchBookEvent } = this.props;
    const { userDetail, selectedBookingDetail, loginSession } = this.state;
    this.toggleConfirmBooking();
    const customerId = get(userDetail, 'userSub') || get(userDetail, 'id');
    const duration = get(selectedBookingDetail, 'durationSec');
    const availabilityId = get(selectedBookingDetail, 'id');
    const startSec = get(selectedBookingDetail, 'providerStartSec');
    const authHeaders = get(loginSession, 'authHeaders');
    dispatchBookEvent({
      customerId, duration, availabilityId, startSec, status: 'UNSPECIFIED', type: 'APPOINTMENT',
    }, authHeaders);
  };

  toggleConfirmBooking = () => {
    this.setState(oldState => ({
      confirmBooking: !oldState.confirmBooking,
    }));
  };

  handleConfirmWaitLists = () => {
    const { dispatchConfirmWaitLists } = this.props;
    const { selectedBookingDetail, userDetailById } = this.state;
    const customerId = get(userDetailById, 'userSub') || get(userDetailById, 'id');
    const duration = get(selectedBookingDetail, 'durationSec');
    const availabilityId = get(selectedBookingDetail, 'id');
    const startSec = get(selectedBookingDetail, 'providerStartSec');
    dispatchConfirmWaitLists({
      customerId, duration, availabilityId, startSec, status: 'UNSPECIFIED', type: 'APPOINTMENT',
    });
  };

  render() {
    const {
      selectedBookingDetail, isRegisterOpen, isLoginOpen, confirmBooking, userDetail,
    } = this.state;
    const waitListId = get(selectedBookingDetail, 'waitListId') || '';
    const headTitle = waitListId ? 'WaitLists Confirmation' : 'Booking Confirmation';
    const sId = get(selectedBookingDetail, 'serviceId');
    const navigateLeftCta = waitListId ? navigateTo('/') : this.handleSelectProvider(sId);

    return (
      <>
        <Loading />
        <Error />
        <CustomModal
          type="info"
          title="Booking confirmation"
          message="Do you want to book the event?"
          isOpen={confirmBooking}
          onClose={this.toggleConfirmBooking}
          okCallBack={this.handleRegisterEvent}
          cancelCallBack={this.toggleConfirmBooking}
          isBackDropClickDisabled
        />
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeDialog}
          handleAuthenticate={this.openAuthModal}
        />
        <div className={s.container}>
          <div className={s.headline}>
            <IconButton color="inherit" onClick={navigateLeftCta}>
              <NavigateBefore color="inherit" />
            </IconButton>
            <div className={s.title}>
              {headTitle}
            </div>
          </div>
          <div className={s.confirmInfo}>
            <ProviderInfo provider={selectedBookingDetail} />
            {!waitListId && (
              <ClientInfo
                userDetail={userDetail}
                onLogin={this.handleOpenLogin}
                onConfirmCta={this.toggleConfirmBooking}
              />
            )}
            {waitListId && (
              <Button variant="outlined" onClick={this.handleConfirmWaitLists}>
                <CheckCircle color="inherit" className="icon-small" />
                Confirm Now!
              </Button>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  bookingProps.mapStateToProps,
  bookingProps.mapDispatchToProps,
)(Booking);
