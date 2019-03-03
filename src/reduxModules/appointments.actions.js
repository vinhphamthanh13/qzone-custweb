import { getAppointmentsByUser } from 'api/appointment';
import { handleRequest } from 'utils/apiHelpers';
import { setLoading } from './home.actions';

export const TOGGLE_APPOINTMENT = 'APPOINTMENTS.TOGGLE_APPOINTMENTS_DIALOG';
export const SET_APPOINTMENT_BY_CUSTOMER = 'SET_APPOINTMENT_BY_CUSTOMER';
export const CLEAR_APPOINTMENTS = 'CLEAR_APPOINTMENTS';

export const toggleAppointment = payload => ({
  type: TOGGLE_APPOINTMENT,
  payload,
});

export const setAppointmentByCustomer = payload => ({
  type: SET_APPOINTMENT_BY_CUSTOMER,
  payload,
});

export const clearAppointments = () => ({
  type: CLEAR_APPOINTMENTS,
});

export const getAppointmentByCustomer = customerId => async (dispatch) => {
  dispatch(setLoading(true));
  const [result] = await handleRequest(getAppointmentsByUser, [customerId], []);
  dispatch(setLoading(false));
  dispatch(setAppointmentByCustomer(result));
};
