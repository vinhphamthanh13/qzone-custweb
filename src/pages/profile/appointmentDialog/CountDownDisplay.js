import React, { Component } from 'react';
import { number, string } from 'prop-types';
import moment from 'moment';
import CountDown from 'react-countdown-now';
import CustomModal from 'components/Modal/CustomModal';

class CountDownDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartingCountDown: false,
      isStoppingCountDown: false,
      startCountDown: props.startTime,
    };
  }

  handleCloseStartPopUp = () => {
    this.setState({
      isStartingCountDown: false,
      isStoppingCountDown: false,
    });
  };

  handleOpenStartPopUp = () => {
    this.setState({
      isStartingCountDown: true,
      isStoppingCountDown: false,
    });
  };

  handleCloseStopPopUp = () => {
    this.setState({
      isStoppingCountDown: false,
      isStartingCountDown: false,
    });
  };

  handleOpenStopPopUp = () => {
    this.setState({
      isStoppingCountDown: true,
      isStartingCountDown: false,
      startCountDown: 0,
    });
  };

  render() {
    const { serviceName, providerName } = this.props;
    const { isStartingCountDown, isStoppingCountDown, startCountDown } = this.state;
    const startCountDownPopup = isStartingCountDown
      ? (
        <CustomModal
          type="info"
          isOpen
          isBackDropClickDisabled
          title="Coming Booking!"
          message={
            `Your booking for ${serviceName} is coming soon,\
             please arrange your time to check in! ${moment(Math.abs(startCountDown)).format('m')} minutes to go.`
          }
          cancelCallBack={this.handleCloseStartPopUp}
        />
      ) : null;
    const stopCountDownPopUP = isStoppingCountDown
      ? (
        <CustomModal
          type="info"
          isOpen
          isBackDropClickDisabled
          title="Booking Serving!"
          message={`Your booking is available now! Enjoy your booking at ${providerName}`}
          cancelCallBack={this.handleCloseStopPopUp}
        />
      ) : null;

    return (
      <>
        {startCountDownPopup}
        {stopCountDownPopUP}
        <CountDown
          date={Date.now() + Math.abs(startCountDown)}
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
