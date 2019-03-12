import React, { useEffect } from 'react';
import {
  arrayOf, shape, func, string,
} from 'prop-types';
import { connect } from 'react-redux';

import EmptyItem from 'components/EmptyItem';
import { getAppointmentByCustomer, clearAppointments } from 'reduxModules/appointments.actions';
import AppointmentTimeline from './AppointmentTimeline';
import styles from './Appointment.module.scss';

const AppointmentContainer = ({
  appointments, userId,
  getAppointmentByCustomerAction, clearAppointmentsAction,
}) => {
  useEffect(() => {
    if (appointments.length > 0 && appointments[0].customerId !== userId) {
      clearAppointmentsAction();
    }
    getAppointmentByCustomerAction(userId);
  }, []);
  return (
    appointments.length === 0
      ? (<EmptyItem message="You don't have any appointment right now" />)
      : (
        <div className={`${styles.appointmentWrapper} container-max auto-margin-horizontal`}>
          <AppointmentTimeline items={appointments} />
        </div>
      )
  );
};

AppointmentContainer.propTypes = {
  appointments: arrayOf(shape()).isRequired,
  getAppointmentByCustomerAction: func.isRequired,
  clearAppointmentsAction: func.isRequired,
  userId: string,
};

AppointmentContainer.defaultProps = {
  userId: null,
};

const mapStateToProps = state => ({
  appointments: state.appointments.appointments,
  userId: state.auth.loginSession.id,
});

const mapDispatchToProps = {
  getAppointmentByCustomerAction: getAppointmentByCustomer,
  clearAppointmentsAction: clearAppointments,
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AppointmentContainer));
