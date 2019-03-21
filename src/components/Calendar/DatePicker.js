import React, { Component } from 'react';
import { func } from 'prop-types';
import moment from 'moment';
import { DateRange } from '@material-ui/icons';
import { IconButton, Typography } from '@material-ui/core';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

class DatePicker extends Component {
  state = {
    selectedDate: new Date(moment().year(), moment().month(), moment().date()),
    isOpenCalendar: false,
  };

  handleChangeDate = (date) => {
    const { onChange } = this.props;
    console.log('current date', date);
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
        <div className={s.calendarCabin}>
          <div className={s.calendarTab}>
            <div className={s.calendarDot}>
              <div className={s.calendarTabCircle} />
              <div className={s.calendarTabCircle} />
            </div>
            <div className={s.calendarText}>
              <Typography variant="h5" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('DD')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarDot}>
              <div className={s.calendarTabCircle} />
              <div className={s.calendarTabCircle} />
            </div>
            <div className={s.calendarText}>
              <Typography variant="h5" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('MMM')}
              </Typography>
            </div>
          </div>
          <div className={s.calendarTab}>
            <div className={s.calendarDot}>
              <div className={s.calendarTabCircle} />
              <div className={s.calendarTabCircle} />
            </div>
            <div className={s.calendarText}>
              <Typography variant="h5" color="inherit" className={s.calendarFont}>
                {moment(selectedDate).format('YYYY')}
              </Typography>
            </div>
          </div>
          <div>
            <IconButton className="simple-button button-xs" onClick={this.handleOpenCalendar}>
              <DateRange className="icon-huge icon-brand icon-shake" />
            </IconButton>`
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
