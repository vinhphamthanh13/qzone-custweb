import React, { Component } from 'react';
import { func } from 'prop-types';
import { DateRange } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

class DatePicker extends Component {
  state = {
    selectedDate: new Date(),
    isOpenCalendar: false,
  };

  handleChangeDate = (date) => {
    const { onChange } = this.props;
    onChange(date);
    this.setState({ selectedDate: date });
  };

  handleOpenCalendar = () => {
    this.setState({ isOpenCalendar: true });
  };

  handleCloseCalendar = () => {
    this.setState({ isOpenCalendar: false });
  };

  render() {
    const { selectedDate, isOpenCalendar } = this.state;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const renderCalendar = isOpenCalendar ? (
      <div className="cover-bg-black">
        <Calendar
          minDate={new Date(year, month, date, 0, 0, 0)}
          maxDate={new Date(year + 11, month, date, 0, 0, 0)}
          date={selectedDate}
          onDateChanged={this.handleChangeDate}
          onClose={this.handleCloseCalendar}
        />
      </div>
    ) : null;
    console.log('selected Date', selectedDate);
    return (
      <div className={s.datePicker}>
        <IconButton className="simple-button button-xs" onClick={this.handleOpenCalendar}>
          <DateRange className="icon-big icon-main icon-shake" />
        </IconButton>
        {renderCalendar}
      </div>
    );
  }
}

DatePicker.propTypes = {
  onChange: func.isRequired,
};

export default DatePicker;
