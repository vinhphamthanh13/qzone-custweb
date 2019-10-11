import React from 'react';
import { arrayOf, any, objectOf } from 'prop-types';
import EmptyItem from 'components/EmptyItem';
import Timeline from './Timeline';
import s from './Appointment.module.scss';

const renderEventList = (list, landingPageFactors) => (list.length > 0 ? (
  <div className={`${s.appointmentWrapper} container-max auto-margin-horizontal`}>
    <Timeline items={list} landingPageFactors={landingPageFactors} /></div>
) : <EmptyItem message="You have no event at the moment!" />);

const Appointment = ({ eventList, landingPageFactors }) => eventList && renderEventList(eventList, landingPageFactors);

Appointment.propTypes = {
  eventList: arrayOf(any),
  landingPageFactors: objectOf(any).isRequired,
};

Appointment.defaultProps = {
  eventList: null,
};

export default Appointment;
