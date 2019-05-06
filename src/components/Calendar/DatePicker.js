import React, { Component } from 'react';
import {
  func,
  bool,
  string,
} from 'prop-types';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { DateRange } from '@material-ui/icons';
import { DATE_FORMAT, INITIAL_TIME } from './constants';
import Calendar from './Calendar';
import s from './DatePicker.module.scss';

class DatePicker extends Component {
  static getDerivedStateFromProps(props, state) {
    const { date } = props;
    const { selectedDate } = state;
    if (date !== selectedDate) {
      return {
        selectedDate: date || selectedDate,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment(),
      isOpenCalendar: false,
    };
  }

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
      type,
      isIcon,
      iconClassName,
      dateFormat,
    } = this.props;
    const datePickerHover = enableCalendar ? 'hover-pointer' : '';
    const renderCalendar = isOpenCalendar && enableCalendar ? (
      <div className="cover-bg-black">
        <Calendar
          minDate={moment(`${moment().format(DATE_FORMAT)}${INITIAL_TIME}`)}
          maxDate={moment(`${moment().add(11, 'y').format(DATE_FORMAT)}${INITIAL_TIME}`)}
          date={selectedDate}
          onDateChanged={this.handleChangeDate}
          onClose={this.handleCloseCalendar}
        />
      </div>
    ) : null;
    const tabStyle = type === 'theme' ? s.calendarTab : s.normalDatePicker;
    const fontStyle = type === 'theme' ? s.calendarFont : '';
    return (
      <div className={s.datePicker}>
        {/* eslint-disable-next-line */}
        <div className={s.calendarCabin} onClick={this.handleOpenCalendar}>
          { isIcon ? (
            <div className={`${s.datePickerIcon} hover-pointer ${iconClassName}`}>
              <DateRange className="icon-normal" />
              <Typography variant="body1" color="inherit">
                {selectedDate.format(dateFormat)}
              </Typography>
            </div>
          )
            : (
            <>
              <div className={`${tabStyle} ${datePickerHover}`}>
                <div className={s.calendarText}>
                  <Typography variant="body1" color="inherit" className={fontStyle}>
                    {selectedDate.format('DD')}
                  </Typography>
                </div>
              </div>
              <div className={tabStyle}>
                <div className={s.calendarText}>
                  <Typography variant="body1" color="inherit" className={fontStyle}>
                    {selectedDate.format('MMMM')}
                  </Typography>
                </div>
              </div>
              <div className={tabStyle}>
                <div className={s.calendarText}>
                  <Typography variant="body1" color="inherit" className={fontStyle}>
                    {selectedDate.format('YYYY')}
                  </Typography>
                </div>
              </div>
            </>
            )}
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
  type: string, // theme, date
  isIcon: bool,
  iconClassName: string,
  dateFormat: string,
};

DatePicker.defaultProps = {
  type: 'theme',
  isIcon: false,
  iconClassName: '',
  dateFormat: 'DD/MM/YYYY',
};

export default DatePicker;
