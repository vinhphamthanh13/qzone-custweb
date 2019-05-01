import { setLoading } from 'actionsReducers/common.actions';
import { getAppointmentsByUser } from 'actionsApi/appointment';
import { handleRequest } from 'utils/apiHelpers';

export const TOGGLE_APPOINTMENT = 'APPOINTMENTS.TOGGLE_APPOINTMENTS_DIALOG';
export const SET_APPOINTMENT_BY_CUSTOMER = 'SET_APPOINTMENT_BY_CUSTOMER';
export const CLEAR_APPOINTMENTS = 'CLEAR_APPOINTMENTS';
export const UPDATE_APPOINTMENT_RATING = 'UPDATE_APPOINTMENT_RATING';

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

export const updateAppointmentRating = payload => ({
  type: UPDATE_APPOINTMENT_RATING,
  payload,
});

export const getAppointmentByCustomer = customerId => async (dispatch) => {
  dispatch(setLoading(true));
  const [result] = await handleRequest(getAppointmentsByUser, [customerId], []);
  dispatch(setLoading(false));
  dispatch(setAppointmentByCustomer(result || []));
};
