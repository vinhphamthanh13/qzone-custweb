import React, { Component } from 'react';
import {
  func,
  bool,
} from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

class DatePicker extends Component {
  state = {
    selectedDate: moment(),
    isOpenCalendar: false,
  };

  componentDidMount() {
    const { selectDate } = this.props;
    const { selectedDate } = this.state;
    selectDate(selectedDate);
  }

  handleChangeDate = (date) => {
    const { onChange } = this.props;
    onChange(date);
    this.setState({ selectedDate: date });
  };

  handleOpenCalendar = () => {
    this.setState({ isOpenCalendar: true });
  };

  handleCloseCalendar = () => {
    const { selectDate } = this.props;
    const { selectedDate } = this.state;
    this.setState({ isOpenCalendar: false });
    selectDate(selectedDate);
  };

  render() {
    const {
      selectedDate,
      isOpenCalendar,
    } = this.state;
    const {
      enableCalendar,
    } = this.props;
    const datePickerHover = enableCalendar ? 'hover-pointer' : '';
    const renderCalendar = isOpenCalendar && enableCalendar ? (
      <div className="cover-bg-black">
        <Calendar
          minDate={moment(`${moment().format('YYYY-MM-DD')}T00:00:00`)}
          maxDate={moment(`${moment().add(11, 'y').format('YYYY-MM-DD')}T00:00:00`)}
          date={selectedDate}
          onDateChanged={this.handleChangeDate}
          onClose={this.handleCloseCalendar}
        />
      </div>
    ) : null;
    return (
      <div className={s.datePicker}>
        {/* eslint-disable-next-line */}
        <div className={s.calendarCabin} onClick={this.handleOpenCalendar}>
          <div className={`${s.calendarTab} ${datePickerHover}`}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {selectedDate.format('DD')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {selectedDate.format('MMMM')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {selectedDate.format('YYYY')}
              </Typography>
            </div>
          </div>
        </div>
        {renderCalendar}
      </div>
    );
  }
}

DatePicker.propTypes = {
  onChange: func.isRequired,
  selectDate: func.isRequired,
  enableCalendar: bool.isRequired,
};

export default DatePicker;
