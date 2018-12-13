import React from 'react';
import Calendar from 'react-big-calendar';
import globalize from 'globalize';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = Calendar.globalizeLocalizer(globalize);

export default function SelectTime() {
  return (
    <Calendar
      selectable
      events={[
        {
          title: 'Service started',
          start: new Date('2018-12-13T08:00'),
          end: new Date('2018-12-13T10:00'),
        },
      ]}
      localizer={localizer}
      defaultView={Calendar.Views.WEEK}
      onSelectEvent={event => alert(event.title)}
    />
  );
}
