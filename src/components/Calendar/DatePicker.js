import React, { Component } from 'react';
import { func } from 'prop-types';
import moment from 'moment';
import { DateRange } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

const today = moment();

class DatePicker extends Component {
  state = {
    selectedDate: new Date(today.year(), today.month(), today.date()),
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
    return (
      <div className={s.datePicker}>
        {/* eslint-disable-next-line */}
        <div className={s.calendarCabin} onClick={this.handleOpenCalendar}>
          <div>
            <div className="simple-button button-xs">
              <DateRange className="icon-big icon-brand icon-shake info-color hover-pointer" />
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('DD')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('MMMM')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarText}>
              <Typography variant="title" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('YYYY')}
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
};

export default DatePicker;
