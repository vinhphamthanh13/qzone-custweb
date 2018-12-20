import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-big-calendar';
import globalize from 'globalize';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './SelectTime.scss';

const localizer = Calendar.globalizeLocalizer(globalize);

export default class SelectTime extends React.PureComponent {
  render() {
    const { onChange } = this.props;
    return (
      <Calendar
        className="select-time-wrapper"
        events={[
          {
            start: new Date('2018-12-20T18:00'),
            end: new Date('2018-12-20T20:00'),
          },
          {
            start: new Date('2018-12-22T03:00'),
            end: new Date('2018-12-22T04:40'),
          },
        ]}
        localizer={localizer}
        defaultView={Calendar.Views.WEEK}
        onSelectEvent={event => onChange(event, 'time')}
        eventPropGetter={(
          event, start, end, isSelected,
        ) => ({ className: isSelected ? 'select-time__selected-event' : 'select-time__event' })}
      />
    );
  }
}

SelectTime.propTypes = {
  onChange: PropTypes.func.isRequired,
};
