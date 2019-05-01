import React, { Component } from 'react';
import { matchType } from 'types/global';
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
    const { match: { params: { id } } } = this.props;
    const { isRegisterOpen, isLoginOpen } = this.state;
    return (
      <>
        <Auth
          isRegisterOpen={isRegisterOpen}
          isLoginOpen={isLoginOpen}
          closeDialog={this.closeAuthModal}
          handleAuthenticate={this.openAuthModal}
          getSessionTimeoutId={this.getSessionTimeoutId}
        />
        <Booking serviceId={id} handleAuth={this.openAuthModal} />
      </>
    );
  }
}

BookingPage.propTypes = {
  match: matchType.isRequired,
};

export default BookingPage;
