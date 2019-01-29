import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { bookingDetailType, serviceType } from 'types/global';
import { getProviderTime } from 'modules/home/bookingDialog/selectProvider.actions';
import CustomLoading from 'components/CustomLoading';
import DateSelect from './selectTime/DateSelect';
import HourSelectBox from './selectTime/HourSelectBox';
import EmptyState from '../services/EmptyState';
import styles from './SelectTime.module.scss';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: moment().tz(this.props.bookingDetail.provider.timeZoneId),
      selectedHour: null,
    };
  }

  componentDidMount() {
    const today = moment();

    if (this.props.bookingDetail.time) {
      const selectedDay = moment(this.props.bookingDetail.time.start);

      this.setState({
        selectedDay,
        selectedHour: selectedDay,
      });

      this.fetchTimeFromDate(
        today.diff(selectedDay, 'd') === 0 ? today : selectedDay,
      );
    } else {
      this.fetchTimeFromDate(today);
    }
  }

  fetchTimeFromDate = (date) => {
    const { bookingDetail: { provider }, initService, getProviderTimeAction } = this.props;
    getProviderTimeAction({
      serviceId: initService.id,
      providerId: provider.id,
      startSec: date.clone().tz(provider.timeZoneId, true).unix(),
      toSec: date.clone().tz(provider.timeZoneId, true).unix(),
    });
  }

  onDateChange = (value) => {
    if (this.state.selectedDay.isSame(value, 'day')) {
      return;
    }
    const date = moment(value);
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
    startHour: moment(d.startSec * 1000).tz(this.props.bookingDetail.provider.timeZoneId),
    durationSec: d.durationSec,
  }))

  render() {
    const { timeDetails, isLoading, bookingDetail } = this.props;
    const { selectedDay, selectedHour } = this.state;
    const hourBoxes = this.getHourBoxes(timeDetails);
    return (
      <div className={styles.selectTimeWrapper}>
        {isLoading
          && <CustomLoading />}
        {!isLoading && hourBoxes.length === 0
          && <EmptyState message="No available slot" />}
        <DateSelect
          selectedDay={selectedDay}
          onChange={this.onDateChange}
          providerTimeZone={bookingDetail.provider.timeZoneId}
        />
        <HourSelectBox
          hourBoxes={hourBoxes}
          selectedHour={selectedHour}
          onChange={this.onHourChange}
        />
      </div>
    );
  }
}

SelectTime.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initService: serviceType,
  getProviderTimeAction: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { getProviderTimeAction: getProviderTime })(SelectTime);
