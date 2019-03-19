import { chunk } from 'lodash';
import {
  THIS_MONTH, THIS_YEAR, CALENDAR_WEEKS, DAYS_OF_WEEK,
} from './constants';

export const zeroPad = (value, length) => `${value}`.padStart(length, '0');

export const getDaysOfMonth = (month = THIS_MONTH, year = THIS_YEAR) => {
  const thirtyDayMonth = [4, 6, 9, 11];
  const leapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  let numberOfDate = 31;
  if (month === 2) {
    if (leapYear) {
      numberOfDate = 29;
    } else {
      numberOfDate = 28;
    }
  } else if (thirtyDayMonth.includes(month)) {
    numberOfDate = 30;
  }
  return numberOfDate;
};

export const getFirstDayOfMonth = (month = THIS_MONTH, year = THIS_YEAR) => +(new Date(
  `${year}-${zeroPad(month, 2)}-01`,
).getDay()) + 1;

export const isDate = (date) => {
  const isDateObject = Object.prototype.toString.call(date) === '[object Date]';
  const isValidDate = date && !Number.isNaN(date.valueOf());
  return isDateObject && isValidDate;
};

export const isSameMonth = (date, baseDate = new Date()) => {
  if (!(isDate(date) && isDate(baseDate))) return false;
  const baseDateMonth = +(baseDate.getMonth()) + 1;
  const baseDateYear = baseDate.getFullYear();
  const dateMonth = +(date.getMonth()) + 1;
  const dateYear = date.getFullYear();
  return baseDateMonth === dateMonth && baseDateYear === dateYear;
};

export const isSameDay = (date, baseDate = new Date()) => {
  if (!(isDate(date) && isDate(baseDate))) return false;
  const baseDateDate = baseDate.getDate();
  const baseDateMonth = +(baseDate.getMonth()) + 1;
  const baseDateYear = baseDate.getFullYear();
  const dateDate = date.getDate();
  const dateMonth = +(date.getMonth()) + 1;
  const dateYear = date.getFullYear();
  return (baseDateDate === dateDate) && (baseDateMonth === dateMonth) && (baseDateYear === dateYear);
};

// Format the given date as DD/MM/YYYY
// Months and days are zero padding
export const getDateISO = (date = new Date()) => {
  if (!isDate(date)) return null;
  return [
    date.getFullYear(),
    zeroPad(+date.getMonth() + 1, 2),
    zeroPad(+date.getDate(), 2),
  ].join('/');
};

export const getLocaleDate = (date = new Date()) => {
  if (!isDate(date)) return null;
  return [
    zeroPad(date.getDate(), 2),
    zeroPad(+date.getMonth() + 1, 2),
    date.getFullYear(),
  ];
};

export const getPreviousMonth = (month, year) => {
  const [previousMonth, previousYear] = +month > 1 ? [+month - 1, year] : [12, +year - 1];
  return { month: previousMonth, year: previousYear };
};

export const getNextMonth = (month, year) => {
  const [nextMonth, nextYear] = +month < 12 ? [+month + 1, year] : [1, +year + 1];
  return { month: nextMonth, year: nextYear };
};

export default (month = THIS_MONTH, year = THIS_YEAR) => {
  // First day and number of days in month
  const daysOfMonth = getDaysOfMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);

  // Fill out day to 6 weeks
  const daysOfPreviousMonth = firstDayOfMonth - 1;
  const daysOfNextMonth = (CALENDAR_WEEKS * 7) - (daysOfPreviousMonth + daysOfMonth);

  // Get the previous and next month and year
  const { month: previousMonth, year: previousYear } = getPreviousMonth(month, year);
  const { month: nextMonth, year: nextYear } = getNextMonth(month, year);

  // Get number of days in previous month
  const previousMonthDays = getDaysOfMonth(previousMonth, previousYear);

  // Build dates to be displayed from previous month
  const previousMonthDates = [
    // eslint-disable-next-line
    ...Array.apply(null, { length: daysOfPreviousMonth }).map((date, index) => {
      const day = index + 1 + (previousMonthDays - daysOfPreviousMonth);
      return [
        previousYear,
        zeroPad(previousMonth, 2),
        zeroPad(day, 2),
      ];
    }),
  ];

  // Build dates to be displayed in current month
  const currentMonthDates = [
    // eslint-disable-next-line
    ...Array.apply(null, { length: daysOfMonth }).map((date, index) => {
      const day = index + 1;
      return [
        year,
        zeroPad(month, 2),
        zeroPad(day, 2),
      ];
    }),
  ];

  // Build dates to be displayed from next month

  const nextMonthDates = [
    // eslint-disable-next-line
    ...Array.apply(null, { length: daysOfNextMonth }).map((date, index) => {
      const day = index + 1;
      return [
        nextYear,
        zeroPad(nextMonth, 2),
        zeroPad(day, 2),
      ];
    }),
  ];

  // Combine all dates
  return chunk([...previousMonthDates, ...currentMonthDates, ...nextMonthDates], DAYS_OF_WEEK);
};
