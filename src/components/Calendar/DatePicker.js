import React, { Component } from 'react';
import { func } from 'prop-types';
import { DateRange } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

class DatePicker extends Component {
  state = {
    selectedDate: '',
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
    const renderCalendar = isOpenCalendar ? (
      <div className="cover-bg-black">
        <Calendar
          minDate={new Date()}
          maxDate={new Date(2038, 0, 1, 0, 0, 0)}
          date={selectedDate}
          onDateChanged={this.handleChangeDate}
          onClose={this.handleCloseCalendar}
        />
      </div>
    ) : null;
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
