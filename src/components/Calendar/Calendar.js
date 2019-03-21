import React, { Component } from 'react';
import {
  instanceOf, oneOfType, string, func,
} from 'prop-types';
import { Button, Typography, IconButton } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { chunk, noop } from 'lodash';
import moment from 'moment';
import calendar, {
  zeroPad,
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
} from './helper';
import {
  WEEK_DAYS, MONTH_NAME, MONTH_INDEX, NUMBER_OF_MONTH_IN_ROW, NUMBER_OF_YEAR_IN_ROW,
} from './constants';
import s from './Calendar.module.scss';

class Calendar extends Component {
  static propTypes = {
    date: oneOfType([instanceOf(Date), string]),
    maxDate: instanceOf(Date),
    minDate: instanceOf(Date),
    onDateChanged: func,
    onClose: func,
  };

  static defaultProps = {
    maxDate: null,
    minDate: null,
    date: null,
    onDateChanged: noop,
    onClose: noop,
  };

  constructor(props) {
    super(props);
    const resolveDate = props.date || props.maxDate;
    this.state = {
      ...this.resolveStateFromDate(resolveDate),
      today: new Date(),
      isClickingYear: false,
      isClickingMonth: false,
      maxYear: props.maxDate.getFullYear(),
      minYear: new Date(),
      toggleMonthSelection: false,
      toggleYearSelection: false,
    };
  }

  componentDidMount() {
    const { current } = this.state;
    const { onDateChanged } = this.props;
    onDateChanged(current);
  }

  resolveStateFromDate = (date) => {
    const isDateObject = isDate(date);
    const $date = isDateObject ? date : new Date();
    return {
      current: isDateObject ? date : null,
      month: +$date.getMonth() + 1,
      year: $date.getFullYear(),
      selectedYear: $date.getFullYear(),
      selectedMonth: +$date.getMonth() + 1,
    };
  };

  getCalendarDates = () => {
    const { current, selectedMonth, selectedYear } = this.state;
    const displayMonth = selectedMonth || +current.getMonth() + 1;
    const displayYear = selectedYear || current.getFullYear();
    return calendar(displayMonth, displayYear);
  };

  onMonthClick = (event) => {
    event.preventDefault();
    this.setState(oldState => (
      {
        isClickingMonth: !oldState.isClickingMonth,
        isClickingYear: false,
        toggleMonthSelection: !oldState.toggleMonthSelection,
        toggleYearSelection: false,
      }
    ));
  };

  onYearClick = (event) => {
    event.preventDefault();
    this.setState(oldState => (
      {
        isClickingYear: !oldState.isClickingYear,
        isClickingMonth: false,
        toggleYearSelection: !oldState.toggleYearSelection,
        toggleMonthSelection: false,
      }
    ));
  };

  // Render month and year header
  renderMonthAndYear = () => {
    const { date } = this.props;
    const {
      selectedMonth, selectedYear, toggleMonthSelection, toggleYearSelection,
    } = this.state;
    const nameOfMonth = MONTH_NAME[
      Object.keys(MONTH_NAME)[Math.max(0, Math.min(+selectedMonth - 1, 11))]
    ];
    const ArrowMonth = toggleMonthSelection ? <KeyboardArrowUp className="icon-white icon-shake" />
      : <KeyboardArrowDown className="icon-white icon-shake" />;
    const ArrowYear = toggleYearSelection ? <KeyboardArrowUp className="icon-white icon-shake" />
      : <KeyboardArrowDown className="icon-white icon-shake" />;
    return (
      <div className={s.calendarHeader}>
        <div className={s.headerToday}>
          <Typography variant="h4" color="inherit">{moment(date).format('ddd, DD MMM YYYY')}</Typography>
        </div>
        <div className={s.monthYearSelection}>
          <div>
            <Typography variant="title" color="inherit" onClick={this.onMonthClick}>
              {nameOfMonth}
              <IconButton className="simple-button button-xs">{ArrowMonth}</IconButton>
            </Typography>
          </div>
          <div>
            <Typography variant="title" color="inherit" onClick={this.onYearClick}>
              {selectedYear}
              <IconButton className="simple-button button-xs">{ArrowYear}</IconButton>
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  // Render the label for day of week
  renderDayLabel = (day, index) => {
    const { isClickingMonth, isClickingYear } = this.state;
    const dayLabel = WEEK_DAYS[day];

    return !isClickingMonth && !isClickingYear ? (
      <div key={dayLabel} tabIndex={index} className={s.dayOfWeek}>
        <Typography variant="subtitle1" color="inherit">{dayLabel}</Typography>
      </div>
    ) : null;
  };

  // Render calendar date as returned from the calendar builder function
  renderCalendarDate = (date, index) => {
    const { minDate, maxDate } = this.props;
    const {
      selectedMonth, selectedYear, today, current,
    } = this.state;
    const $date = new Date(date.join('-'));
    const sameDate = isSameDay(current, $date);
    const isToday = isSameDay($date, today);
    const inMonth = selectedMonth && selectedYear && isSameMonth(
      $date, new Date([selectedYear, selectedMonth, 1].join('-')),
    );
    const shortMaxDate = new Date(
      `${zeroPad(maxDate.getMonth() + 1, 2)}/${zeroPad(
        maxDate.getDate() + 1,
        2,
      )}/${maxDate.getFullYear()}`,
    );
    const isValidDate = $date < shortMaxDate && $date > minDate;
    const onClick = isValidDate ? this.gotoDate($date) : noop;
    const props = {
      index,
      onClick,
    };
    const formatToday = isToday || sameDate ? `${s.today}` : '';
    const formatMonth = inMonth ? `${s.month}` : '';
    const dateStyles = isValidDate
      ? `${formatMonth} ${formatToday}`
      : `${s.invalidDate}`;
    return (
      <div
        key={getDateISO($date)}
        className={`${s.dateOfMonth} ${dateStyles}`}
        {...props}
      >
        <Typography variant="subtitle1" color="inherit">{zeroPad($date.getDate(), 2)}</Typography>
      </div>
    );
  };

  // Render calendar week
  renderWeekDays = () => {
    const { isClickingYear, isClickingMonth } = this.state;
    return (
      !isClickingYear && !isClickingMonth
      && this.getCalendarDates().map((week, index) => (
        <div className={s.week} key={week[index]}>
          {week.map((day, tInd) => this.renderCalendarDate(day, tInd))}
        </div>
      ))
    );
  };

  gotoDate = date => (event) => {
    // eslint-disable-next-line
    event && event.preventDefault();
    const { onDateChanged } = this.props;
    this.setState(this.resolveStateFromDate(date), () => {
      // eslint-disable-next-line
      (typeof onDateChanged === 'function') && onDateChanged(date);
    });
  };

  renderMonthMatrix = () => {
    const { maxDate, minDate } = this.props;
    const { selectedYear, current } = this.state;
    const quarter = chunk(Object.keys(MONTH_NAME), NUMBER_OF_MONTH_IN_ROW);
    return quarter.map((monthRow, index) => (
      // eslint-disable-next-line
      <div key={index} className={s.monthRow}>
        {monthRow.map((month) => {
          const compareMaxDate = new Date(selectedYear, MONTH_INDEX[month], maxDate.getDate(), 0, 0, 0);
          const compareMinDate = new Date(selectedYear, MONTH_INDEX[month], maxDate.getDate(), 0, 0, 1);
          const isValidMonth = compareMaxDate <= maxDate && compareMinDate >= minDate;
          const currentMonthStyle = +current.getMonth() === MONTH_INDEX[month] ? s.currentMonthYear : '';

          const className = isValidMonth
            ? `${s.monthCell} ${currentMonthStyle}` : `${s.monthCell} ${s.invalidMonth}`;
          const onClick = isValidMonth
            ? this.onMonthSelected(MONTH_INDEX[month]) : noop;
          const props = {
            className,
            onClick,
          };
          return (
            <div key={month} {...props}>
              <div>
                <Typography variant="title" color="inherit">{MONTH_NAME[month]}</Typography>
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  renderMonthList = () => {
    const { isClickingMonth } = this.state;
    return isClickingMonth ? (
      <div className={s.monthList}>{this.renderMonthMatrix()}</div>
    ) : null;
  };

  onMonthSelected = month => (event) => {
    const { selectedYear, current } = this.state;
    this.gotoDate(new Date(selectedYear, month, current.getDate()));
    event.preventDefault();
    this.setState({
      selectedMonth: +month + 1,
      isClickingMonth: false,
    });
  };

  onYearSelected = year => (event) => {
    event.preventDefault();
    this.setState({
      selectedYear: year,
      isClickingYear: false,
    });
  };

  parseYearRange = () => {
    const { maxYear, minYear } = this.state;
    const yearRange = Array.from(
      { length: maxYear - minYear + 1 },
      (value, index) => minYear + index,
    );
    return chunk(yearRange, NUMBER_OF_YEAR_IN_ROW);
  };

  renderYearMatrix = () => {
    const { minDate, maxDate } = this.props;
    const { selectedMonth, current } = this.state;
    const yearMatrix = this.parseYearRange();
    return yearMatrix.reverse().map((yearRow, index) => {
      let fullYearRow = null;
      if (yearRow.length < NUMBER_OF_YEAR_IN_ROW) {
        fullYearRow = Array.from({ length: NUMBER_OF_YEAR_IN_ROW }, (value, tInd) => tInd + yearRow[0]);
      } else {
        fullYearRow = yearRow.slice();
      }
      return (
        // eslint-disable-next-line
        <div key={index} className={s.yearRow}>
          {fullYearRow.reverse().map((year) => {
            const compareMaxDate = new Date(year, +selectedMonth - 1, maxDate.getDate(), 0, 0, 0);
            const compareMinDate = new Date(year, +selectedMonth - 1, maxDate.getDate(), 0, 0, 1);
            const isValidYear = compareMaxDate <= maxDate && compareMinDate >= minDate;
            const currentYearStyle = current.getFullYear() === year ? s.currentMonthYear : '';
            const className = isValidYear
              ? `${s.yearCell}  ${currentYearStyle}` : `${s.yearCell} ${s.invalidYear}`;
            const onClick = isValidYear ? this.onYearSelected(year) : noop;
            const props = {
              className,
              onClick,
            };
            return (
              <li key={year} {...props}>
                <Typography variant="subheading" color="inherit">{year}</Typography>
              </li>
            );
          })}
        </div>
      );
    });
  };

  renderYearList = () => {
    const { isClickingYear } = this.state;
    return isClickingYear ? (
      <div className={s.yearList}>{this.renderYearMatrix()}</div>
    ) : null;
  };

  renderOkButton = () => {
    const { isClickingMonth, isClickingYear } = this.state;
    const { onClose } = this.props;
    return !isClickingMonth && !isClickingYear ? (
      <Button className={s.buttonOk} onClick={onClose}>
        <Typography variant="subheading" color="inherit">OK</Typography>
      </Button>
    ) : null;
  };

  render() {
    console.log('calendar style', s);
    return (
      <>
        <div className={s.calendar}>
          {this.renderMonthAndYear()}
          <div className={s.grid}>
            <div className={s.daysOfWeek}>
              {Object.keys(WEEK_DAYS).map(this.renderDayLabel)}
            </div>
            <div className={s.datesOfMonth}>{this.renderWeekDays()}</div>
            {this.renderYearList()}
            {this.renderMonthList()}
          </div>
          {this.renderOkButton()}
        </div>
      </>
    );
  }
}

export default Calendar;
