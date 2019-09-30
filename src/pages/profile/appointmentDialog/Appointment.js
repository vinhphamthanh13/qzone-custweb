import React from 'react';
import { arrayOf, any } from 'prop-types';
import EmptyItem from 'components/EmptyItem';
import Timeline from './Timeline';
import s from './Appointment.module.scss';

const renderEventList = list => (list.length > 0 ? (
  <div className={`${s.appointmentWrapper} container-max auto-margin-horizontal`}><Timeline items={list} /></div>
) : <EmptyItem message="You have no event at the moment!" />);

const Appointment = ({ eventList }) => eventList && renderEventList(eventList);

Appointment.propTypes = {
  eventList: arrayOf(any),
};

Appointment.defaultProps = {
  eventList: null,
};

export default Appointment;
