import React from 'react';
import { connect } from 'react-redux';
// import mtz from 'moment-timezone';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import {
  bool, func, number, arrayOf, shape,
} from 'prop-types';
import { get, chunk } from 'lodash';
import { bookingDetailType, providerType } from 'types/global';
// import EmptyItem from 'components/EmptyItem';
// import HourSelectBox from './selectTime/HourSelectBox';
import styles from './SelectTime.module.scss';

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
    console.log('start', start);
    console.log('duration', duration);
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
        return ({
          key,
          time: new Date(hourStep),
          display: moment(hourStep).format('HH:MM'),
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
    <div className="time-row">
      {row.map((slot) => {
        const {
          display, valid, action,
        } = slot;
        const slotStyle = valid ? 'time-slot' : 'invalid-slot';
        return (
          <div className={slotStyle}>
            <Typography variant="body2" color="primary" onClick={action}>
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
    const hourBoxes = this.getHourBoxes(timeDetails);
    return (
      <div className={styles.selectTimeWrapper}>
        {selectedHour} {isLoading}
        {this.renderTimeBox(hourBoxes)}
      </div>
    );
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
