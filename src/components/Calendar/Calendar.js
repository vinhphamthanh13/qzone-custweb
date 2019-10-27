import React, { Component } from 'react';
import {
  func,
  objectOf,
  any,
} from 'prop-types';
import { Button, Typography, IconButton } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import chunk from 'lodash/chunk';
import noop from 'lodash/noop';
import moment from 'moment';
import uuidv1 from 'uuid/v1';
import calendar, {
  zeroPad,
} from './helper';
import {
  WEEK_DAYS,
  MONTH_NAME,
  MONTH_INDEX,
  NUMBER_OF_MONTH_IN_ROW,
  NUMBER_OF_YEAR_IN_ROW,
  DATE_FORMAT,
  INITIAL_TIME, DISPLAY_FORMAT,
} from './constants';
import s from './Calendar.module.scss';

class Calendar extends Component {
  static propTypes = {
    date: objectOf(any).isRequired,
    maxDate: objectOf(any).isRequired,
    minDate: objectOf(any).isRequired,
    onDateChanged: func,
    onClose: func,
  };

  static defaultProps = {
    onDateChanged: noop,
    onClose: noop,
  };

  constructor(props) {
    super(props);
    const { date, maxDate, minDate } = props;
    const resolveDate = date || minDate;
    this.initValues = {
      today: moment(`${moment().format(DATE_FORMAT)}${INITIAL_TIME}`),
      ...this.resolveStateFromDate(resolveDate),
      maxYear: maxDate.year(),
      minYear: minDate.year(),
      isClickingYear: false,
      isClickingMonth: false,
      toggleMonthSelection: false,
      toggleYearSelection: false,
    };
    this.state = { ...this.initValues };
  }

  componentDidMount() {
    const { current } = this.state;
    const { onDateChanged } = this.props;
    onDateChanged(current);
  }

  resolveStateFromDate = date => ({
    current: moment(`${moment(date).format(DATE_FORMAT)}${INITIAL_TIME}`),
    month: date.month(),
    selectedMonth: date.month(),
    year: date.year(),
    selectedYear: date.year(),
  });

  getCalendarDates = () => {
    const { selectedMonth, selectedYear } = this.state;
    return calendar(selectedMonth + 1, selectedYear);
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
      Object.keys(MONTH_NAME)[Math.max(0, Math.min(selectedMonth, 11))]
    ];
    const ArrowMonth = toggleMonthSelection ? <KeyboardArrowUp className="icon-white icon-shake" />
      : <KeyboardArrowDown className="icon-white icon-shake" />;
    const ArrowYear = toggleYearSelection ? <KeyboardArrowUp className="icon-white icon-shake" />
      : <KeyboardArrowDown className="icon-white icon-shake" />;
    return (
      <div className={s.calendarHeader}>
        <div className={s.headerToday}>
          <Typography variant="h4" color="inherit">{date.format(DISPLAY_FORMAT)}</Typography>
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
              <IconButton className="simple-button button-xs">{ArrowYear}</IconButton>
              {selectedYear}
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
    const $date = moment(`${date.join('-')}${INITIAL_TIME}`);
    const sameDate = $date.isSame(current, 'day');
    const isToday = $date.isSame(today, 'day');
    const inMonth = selectedMonth && selectedYear
      && $date.isSame(current, 'month');
    const isValidDate = $date < maxDate && $date >= minDate;
    const onClick = isValidDate ? this.gotoDate($date) : noop;
    const props = {
      index,
      onClick,
    };
    const formatToday = isToday ? `${s.today}` : '';
    const formatSameDay = sameDate ? `${s.sameDay}` : '';
    const formatMonth = inMonth ? `${s.month}` : '';
    const dateStyles = isValidDate
      ? `${formatMonth} ${formatToday}`
      : `${s.invalidDate}`;
    return (
      <div
        key={uuidv1()}
        className={`${s.dateOfMonth} ${dateStyles} ${formatSameDay}`}
        {...props}
      >
        <Typography variant="body1" color="inherit">{zeroPad($date.date(), 2)}</Typography>
      </div>
    );
  };

  // Render calendar week
  renderWeekDays = () => {
    const { isClickingYear, isClickingMonth } = this.state;
    return (
      !isClickingYear && !isClickingMonth
      && this.getCalendarDates().map(week => (
        <div className={s.week} key={uuidv1()}>
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
    return quarter.map(monthRow => (
      // eslint-disable-next-line
      <div key={uuidv1()} className={s.monthRow}>
        {monthRow.map((month) => {
          const currentMonthDate = moment(
            `${[selectedYear, zeroPad(MONTH_INDEX[month] + 1, 2), maxDate.date()].join('-')}${INITIAL_TIME}`,
          );
          const isValidMonth = currentMonthDate <= maxDate && currentMonthDate >= minDate;
          const currentMonthStyle = current.month() === MONTH_INDEX[month] ? s.currentMonthYear : '';

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
    event.preventDefault();
    const { selectedYear, current } = this.state;
    this.gotoDate(moment(`${[selectedYear, zeroPad(month + 1, 2), current.date()].join('-')}${INITIAL_TIME}`));
    this.setState(oldState => ({
      selectedMonth: month,
      isClickingMonth: !oldState.isClickingMonth,
      isClickingYear: false,
      toggleMonthSelection: !oldState.toggleMonthSelection,
      toggleYearSelection: false,
    }));
  };

  onYearSelected = year => (event) => {
    event.preventDefault();
    this.setState(oldState => ({
      selectedYear: year,
      isClickingYear: !oldState.isClickingYear,
      isClickingMonth: false,
      toggleYearSelection: !oldState.toggleYearSelection,
      toggleMonthSelection: false,
    }));
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
    return yearMatrix.map((yearRow) => {
      let fullYearRow = null;
      if (yearRow.length < NUMBER_OF_YEAR_IN_ROW) {
        fullYearRow = Array.from({ length: NUMBER_OF_YEAR_IN_ROW }, (value, tInd) => tInd + yearRow[0]);
      } else {
        fullYearRow = yearRow.slice();
      }
      return (
        // eslint-disable-next-line
        <div key={uuidv1()} className={s.yearRow}>
          {fullYearRow.map((year) => {
            const currentYear = moment(
              `${[year, zeroPad(selectedMonth + 1, 2), maxDate.date()].join('-')}${INITIAL_TIME}`,
            );
            const isValidYear = currentYear <= maxDate && currentYear >= minDate;
            const currentYearStyle = current.year() === year ? s.currentMonthYear : '';
            const className = isValidYear
              ? `${s.yearCell}  ${currentYearStyle}` : `${s.yearCell} ${s.invalidYear}`;
            const onClick = isValidYear ? this.onYearSelected(year) : noop;
            const props = {
              className,
              onClick,
            };
            return (
              <li key={year} {...props}>
                <Typography variant="title" color="inherit">{year}</Typography>
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

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({ ...this.initValues });
    onClose();
  };

  renderOkButton = () => {
    const { isClickingMonth, isClickingYear } = this.state;
    return !isClickingMonth && !isClickingYear ? (
      <Button className={s.buttonOk} onClick={this.handleClose}>
        <Typography variant="subheading" color="inherit">OK</Typography>
      </Button>
    ) : null;
  };

  render() {
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
