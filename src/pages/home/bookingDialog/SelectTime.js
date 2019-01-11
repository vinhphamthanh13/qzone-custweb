import React from 'react';
// import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import SelectTimeView from './SelectTime.view';
import './SelectTime.scss';

export default class SelectTime extends React.PureComponent {
  constructor(props) {
    super(props);

    const dateBoxes = this.getDateBoxes();
    const hourBoxes = this.getHourBoxes(dateBoxes[1]);
    this.state = {
      dateBoxes,
      hourBoxes,
      selectedDay: dateBoxes[1],
      selectedHour: null,
    };
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
      new Date(today.getTime() - aDayInMiliSec),
      today,
      new Date(today.getTime() + aDayInMiliSec),
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
  // onChange: PropTypes.func.isRequired,
};
