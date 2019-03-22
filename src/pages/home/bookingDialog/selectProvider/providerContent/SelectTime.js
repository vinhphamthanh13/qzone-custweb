import React from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import {
  bool, func, number, arrayOf, shape,
} from 'prop-types';
import { get, chunk, noop } from 'lodash';
import { bookingDetailType, providerType } from 'types/global';
import zeroPad from 'utils/zeroPad';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedHour: null,
    };
  }

  componentDidMount() {
    const { bookingDetail, providerDetail } = this.props;
    if (bookingDetail.provider && bookingDetail.time && providerDetail.id === bookingDetail.provider.id) {
      this.setState({
        selectedHour: moment(bookingDetail.time.start),
      });
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return nextProps.bookingDetail.provider && nextProps.providerDetail.id === nextProps.bookingDetail.provider.id
      && nextProps.bookingDetail.time
      ? {}
      : { selectedHour: null };
  }

  onHourChange = ({ start, duration }) => (event) => {
    event.preventDefault();
    this.props.onChange({
      start: start.valueOf(),
      duration,
    });
    this.setState({ selectedHour: start });
  };

  getHourBoxes = (timeDetails) => {
    const { bookingDetail: { selectedDate } } = this.props;
    const startDay = new Date(selectedDate);
    const year = startDay.getFullYear();
    const month = +startDay.getMonth() + 1;
    const date = startDay.getDate();
    const startHourRange = new Date(`${year}-${month}-${date} 00:00:00`);
    let hourStep = startHourRange.getTime() - 1800000;
    const timeSlots = Array.from({ length: 48 }, (_, key) => {
      hourStep += 1800000;
      const startTime = new Date(hourStep);

      return ({
        key,
        time: startTime,
        display: `${zeroPad(startTime.getHours(), 2)}:${zeroPad(startTime.getMinutes(), 2)}`,
        duration: 0,
        valid: false,
        canBook: false,
        action: noop,
      });
    });
    const mergeTime = timeSlots.map((slot) => {
      const newSlot = Object.assign({}, { ...slot });
      // There is a mutation if the provider has more than one slot.
      // So, re-assign the original to the slot if condition is not satisfied is correct.
      // eslint-disable-next-line
      timeDetails.map((bookedSlot) => {
        const customer = new Date(get(bookedSlot, 'customerStartSec'));
        const customerStartSec = customer.getTime();
        const durationSec = get(bookedSlot, 'durationSec');
        newSlot.valid = customerStartSec === newSlot.time.getTime();
        newSlot.duration = newSlot.valid ? durationSec : newSlot.duration;
        newSlot.canBook = newSlot.valid && +customerStartSec > +moment.now() ? true : newSlot.canBook;
        newSlot.action = newSlot.valid && newSlot.canBook
          ? this.onHourChange({ start: customerStartSec, duration: durationSec }) : newSlot.action;
      });
      return newSlot;
    });
    return chunk(mergeTime, 12);
  };

  renderTimeBox = list => list.map(row => (
    <div key={Math.random()} className="time-row">
      {row.map((slot) => {
        const {
          display, valid, action, duration, canBook,
        } = slot;
        const slotStyle = valid || duration > 0 ? 'valid-slot' : 'invalid-slot';
        const bookStyle = duration && canBook ? slotStyle : 'kantBook';
        return (
          <div key={Math.random()} className={`time-slot ${bookStyle}`}>
            <Typography variant="body1" color="inherit" onClick={duration > 0 && canBook ? action : noop}>
              {display}
            </Typography>
          </div>
        );
      })}
    </div>
  ));

  render() {
    const {
      timeDetails,
      isLoading,
    } = this.props;
    const { selectedHour } = this.state;
    console.log('isLoading', isLoading, selectedHour);
    // console.log('timeDetails', timeDetails);
    const hourBoxes = this.getHourBoxes(timeDetails);
    console.log('hourboxes', hourBoxes);
    return this.renderTimeBox(hourBoxes);
  }
}

SelectTime.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  timeDetails: arrayOf(
    shape({
      startSec: number,
      durationSec: number,
      spotsOpen: number,
    }),
  ),
  onChange: func.isRequired,
  isLoading: bool,
  providerDetail: providerType.isRequired,
};

SelectTime.defaultProps = {
  timeDetails: [],
  isLoading: false,
};

const mapStateToProps = (states, ownProps) => ({
  isLoading: states.homeModules.bookingDialog.isLoading,
  timeDetails: states.homeModules.bookingDialogModules.selectProvider.providerDetails[ownProps.providerDetail.id],
});

export default connect(mapStateToProps)(SelectTime);
