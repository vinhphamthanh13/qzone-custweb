import React, { Component } from 'react';
import { number, string } from 'prop-types';
import moment from 'moment';
import CountDown from 'react-countdown-now';
import CustomModal from 'components/Modal/CustomModal';

class CountDownDisplay extends Component {
  state = {
    isStartingCountDown: false,
    isStoppingCountDown: false,
  };

  handleCloseStartPopUp = () => {
    this.setState({ isStartingCountDown: false });
  };

  handleOpenStartPopUp = () => {
    console.log('start contdown', this.state);
    this.setState({ isStartingCountDown: true });
  };

  handleCloseStopPopUp = () => {
    this.setState({ isStoppingCountDown: false });
  };

  handleOpenStopPopUp = () => {
    this.setState({ isStoppingCountDown: true });
  };

  render() {
    const { startTime, serviceName, providerName } = this.props;
    const { isStartingCountDown, isStoppingCountDown } = this.state;
    const startCountDown = startTime * 60 * 1000; // in minute
    const startCountDownPopup = isStartingCountDown
      ? (
        <CustomModal
          isOpen
          title="Coming Booking!"
          message={
            `Your booking for ${serviceName} is coming soon,\
             please arrange your time to check in! ${moment(startCountDown).format('m')} minutes to go.`
          }
          onClose={this.handleCloseStartPopUp}
        />
      ) : null;
    const stopCountDownPopUP = isStoppingCountDown
      ? (
        <CustomModal
          isOpen
          title="Booking Serving!"
          message={`Your booking is available now! Enjoy your booking at ${providerName}`}
          onClose={this.handleCloseStopPopUp}
        />
      ) : null;

    return (
      <>
        {startCountDownPopup}
        {stopCountDownPopUP}
        <CountDown
          date={Date.now() + startCountDown}
          renderer={({ hours, minutes, seconds }) => (
            <span className="gallery-color">
              {hours} hr, {minutes} min, {seconds} sec
            </span>)}
          onStart={this.handleOpenStartPopUp}
          onComplete={this.handleOpenStopPopUp}
        />
      </>
    );
  }
}

CountDownDisplay.propTypes = {
  startTime: number.isRequired,
  serviceName: string.isRequired,
  providerName: string.isRequired,
};

export default CountDownDisplay;
