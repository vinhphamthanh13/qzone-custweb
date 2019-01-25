import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { bookingDetailType, serviceType } from 'types/global';
import { getProviderTime } from 'modules/home/bookingDialog/selectProvider.actions';

import SelectTimeView from './SelectTime.view';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);

    this.timeZone = this.props.bookingDetail.provider.timeZoneId;
    this.state = {
      selectedDay: moment().tz(this.timeZone),
      selectedHour: null,
    };
  }

  componentDidMount() {
    if (this.props.bookingDetail.time) {
      const selectedDay = moment(this.props.bookingDetail.time.start).tz(this.timeZone);
      this.setState({
        selectedDay,
        selectedHour: selectedDay,
      });

      const today = moment().tz(this.timeZone);
      this.fetchTimeFromDate(
        today.diff(selectedDay, 'd') === 0 ? today : selectedDay.clone().startOf('d'),
      );
    } else {
      this.fetchTimeFromDate();
    }
  }

  fetchTimeFromDate = (date) => {
    this.props.getProviderTime({
      serviceId: this.props.initService.id,
      providerId: this.props.bookingDetail.provider.id,
      startSec: moment(date).tz(this.timeZone).unix(),
    });
  }

  onDateChange = (value) => {
    if (this.state.selectedDay.isSame(value, 'day')) {
      return;
    }
    const date = moment(value).tz(this.timeZone);
    this.fetchTimeFromDate(date);
    this.setState({
      selectedDay: date,
      selectedHour: null,
    });
  }

  onHourChange = ({ start, duration }) => {
    this.props.onChange({
      start: start.valueOf(),
      end: start.valueOf() + (duration * 1000),
    }, 'time');
    this.setState({ selectedHour: start });
  }

  getHourBoxes = timeDetails => timeDetails.map(d => ({
    spotsOpen: d.spotsOpen,
    spotsTotal: d.spotsTotal,
    startHour: moment(d.startSec * 1000).tz(this.timeZone),
    durationSec: d.durationSec,
  }))

  render() {
    const { timeDetails, isLoading } = this.props;
    const { selectedDay, selectedHour } = this.state;
    return (
      <SelectTimeView
        hourBoxes={this.getHourBoxes(timeDetails)}
        selectedDay={selectedDay}
        selectedHour={selectedHour}
        onDateChange={this.onDateChange}
        onHourChange={this.onHourChange}
        isLoading={isLoading}
        providerTimeZone={this.timeZone}
      />
    );
  }
}

SelectTime.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initService: serviceType,
  getProviderTime: PropTypes.func.isRequired,
  timeDetails: PropTypes.arrayOf(
    PropTypes.shape({
      startSec: PropTypes.number,
      durationSec: PropTypes.number,
      spotsOpen: PropTypes.number,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

SelectTime.defaultProps = {
  timeDetails: [],
  isLoading: true,
  initService: null,
};

const mapStateToProps = (states, ownProps) => ({
  timeDetails: states.homeModules.bookingDialog.selectProvider.providerDetails[ownProps.bookingDetail.provider.id],
  isLoading: states.homeModules.bookingDialog.selectProvider.isLoading,
});

export default connect(mapStateToProps, { getProviderTime })(SelectTime);
