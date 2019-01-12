import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bookingDetailType, serviceType } from 'types/global';
import { getProviderTime } from 'modules/home/bookingDialog/selectProvider.actions';

import SelectTimeView from './SelectTime.view';
import './SelectTime.scss';

export class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);

    const dateBoxes = this.getDateBoxes();
    const selectedDay = dateBoxes[0];
    const hourBoxes = this.getHourBoxes(selectedDay);

    this.state = {
      dateBoxes,
      hourBoxes,
      selectedDay,
      selectedHour: null,
    };
  }

  componentDidMount() {
    this.props.getProviderTime({
      serviceId: this.props.initService.id,
      providerId: this.props.bookingDetail.provider.id,
      startSec: (new Date()).getTime() / 1000,
    });
  }

  onDateChange = (date) => {
    this.setState({
      selectedDay: date,
      hourBoxes: this.getHourBoxes(date),
      selectedHour: null,
    });
  }

  onHourChange = (date) => {
    this.setState({ selectedHour: date });
  }

  getDateBoxes = () => {
    const today = new Date();
    const aDayInMiliSec = 24 * 60 * 60 * 1000;
    return [
      today,
      new Date(today.getTime() + aDayInMiliSec),
      new Date(today.getTime() + (2 * aDayInMiliSec)),
    ];
  }

  getHourBoxes = (date) => {
    const dayHours = 24;
    const hourBoxes = [];
    for (let i = 0; i < dayHours; i += 1) {
      hourBoxes.push(new Date(date.setHours(i)));
    }
    return hourBoxes;
  }

  render() {
    // const { onChange } = this.props;
    const {
      dateBoxes, hourBoxes, selectedDay, selectedHour,
    } = this.state;
    return (
      <SelectTimeView
        dateBoxes={dateBoxes}
        hourBoxes={hourBoxes}
        selectedDay={selectedDay}
        selectedHour={selectedHour}
        onDateChange={this.onDateChange}
        onHourChange={this.onHourChange}
      />
    );
  }
}

SelectTime.propTypes = {
  bookingDetail: bookingDetailType.isRequired,
  initService: serviceType.isRequired,
  getProviderTime: PropTypes.func.isRequired,
  // onChange: PropTypes.func.isRequired,
};

export default connect(null, { getProviderTime })(SelectTime);
