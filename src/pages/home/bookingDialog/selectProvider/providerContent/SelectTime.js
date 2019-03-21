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
    let timeRanges = [];
    timeDetails.map((d) => {
      const startDay = new Date();
      const year = startDay.getFullYear();
      const month = +startDay.getMonth() + 1;
      const date = startDay.getDate();
      const startHourRange = new Date(`${year}-${month}-${date} 00:00`);
      const hourStart = startHourRange.getTime() - 1800000;
      const customer = new Date(get(d, 'customerStartSec'));
      const customerStartSec = customer.getTime();
      const durationSec = get(d, 'durationSec');
      let hourStep = hourStart;
      const timeSlots = Array.from({ length: 48 }, (_, key) => {
        hourStep += 1800000;
        const startTime = new Date(hourStep);
        return ({
          key,
          time: startTime,
          display: `${zeroPad(startTime.getHours(), 2)}:${zeroPad(startTime.getMinutes(), 2)}`,
          duration: durationSec,
          valid: customerStartSec === hourStep,
          action: this.onHourChange({ start: hourStep, duration: durationSec }),
        });
      });
      timeRanges = chunk(timeSlots, 12);
      return timeRanges;
    });
    return timeRanges;
  };

  renderTimeBox = list => list.map(row => (
    <div key={Math.random()} className="time-row">
      {row.map((slot) => {
        const {
          display, valid, action,
        } = slot;
        const slotStyle = valid ? 'valid-slot' : 'invalid-slot';
        return (
          <div className={`time-slot ${slotStyle}`}>
            <Typography variant="body1" color="inherit" onClick={valid ? action : noop}>
              {display}
            </Typography>
          </div>
        );
      })}
    </div>
  ));

  render() {
    const { timeDetails, isLoading } = this.props;
    const { selectedHour } = this.state;
    console.log('isLoading', isLoading, selectedHour);
    const hourBoxes = this.getHourBoxes(timeDetails);

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
