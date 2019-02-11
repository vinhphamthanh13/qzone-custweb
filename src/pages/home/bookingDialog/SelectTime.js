import React from 'react';
import { connect } from 'react-redux';
import mtz from 'moment-timezone';
import PropTypes from 'prop-types';
import { bookingDetailType, serviceType } from 'types/global';
import { getProviderTime } from 'modules/home/bookingDialog/selectProvider.actions';
import DateSelect from './selectTime/DateSelect';
import HourSelectBox from './selectTime/HourSelectBox';
import EmptyItem from '../services/EmptyItem';
import styles from './SelectTime.module.scss';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: mtz(),
      selectedHour: null,
    };
  }

  componentDidMount() {
    const today = mtz();

    if (this.props.bookingDetail.time) {
      const selectedDay = mtz(this.props.bookingDetail.time.start);

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
    const providerDateBySec = date.clone().tz(provider.timeZoneId).unix();
    getProviderTimeAction({
      serviceId: initService.id,
      providerId: provider.id,
      startSec: providerDateBySec,
      toSec: providerDateBySec,
    });
  }

  onDateChange = (value) => {
    if (this.state.selectedDay.isSame(value, 'day')) {
      return;
    }
    const date = mtz(value);
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

  getHourBoxes = (timeDetails) => {
    const today = mtz();
    const localOffset = today.clone().utcOffset();
    const providerOffset = today.clone().tz(this.props.bookingDetail.provider.timeZoneId).utcOffset();
    const hourToLocalOffset = (localOffset - providerOffset) / 60;
    return timeDetails.map(d => ({
      spotsOpen: d.spotsOpen,
      spotsTotal: d.spotsTotal,
      startHour: mtz(d.startSec * 1000).add(hourToLocalOffset, 'h'),
      durationSec: d.durationSec,
    }));
  }

  render() {
    const { timeDetails, isLoading } = this.props;
    const { selectedDay, selectedHour } = this.state;
    const hourBoxes = this.getHourBoxes(timeDetails);
    return (
      <div className={styles.selectTimeWrapper}>
        {!isLoading && hourBoxes.length === 0
          && <EmptyItem message="No available slot" />}
        {hourBoxes.length > 0
          && <>
            <DateSelect
              selectedDay={selectedDay}
              onChange={this.onDateChange}
            />
            <HourSelectBox
              hourBoxes={hourBoxes}
              selectedHour={selectedHour}
              onChange={this.onHourChange}
            />
          </>}
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
