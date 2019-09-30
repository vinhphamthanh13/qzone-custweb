import React, { Component } from 'react';
import { noop } from 'lodash';
import { matchType } from 'types/global';
import { BOOKING } from 'utils/constants';
import Auth from './Auth';
import Booking from './booking/Booking';

class BookingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegisterOpen: false,
      isLoginOpen: false,
    };
  }

  openAuthModal = (key) => {
    this.setState({ [key]: true });
  };

  closeAuthModal = (key) => {
    this.setState({ [key]: false });
  };

  render() {
    const { match: { params: { id }, path } } = this.props;
    const { isRegisterOpen, isLoginOpen } = this.state;
    const sId = BOOKING.PATH.NORMAL.test(path) ? id : null;
    const tId = BOOKING.PATH.INSTANT.test(path) ? id : null;
    const wId = BOOKING.PATH.WAITLIST.test(path) ? id : null;
    return (
      <>
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeAuthModal}
          handleAuthenticate={this.openAuthModal}
          onReloadApp={noop}
          isInstantBooking={tId}
        />
        <Booking
          serviceId={sId}
          waitListId={wId}
          temporaryServiceId={tId}
          handleAuth={this.openAuthModal}
          showPage
        />
      </>
    );
  }
}

BookingPage.propTypes = {
  match: matchType.isRequired,
};

export default BookingPage;
