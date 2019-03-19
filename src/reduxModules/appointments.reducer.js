import {
  TOGGLE_APPOINTMENT,
  SET_APPOINTMENT_BY_CUSTOMER,
  CLEAR_APPOINTMENTS,
  UPDATE_APPOINTMENT_RATING,
} from './appointments.actions';

const initialState = {
  isOpen: false,
  appointments: [],
};

const appointments = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_APPOINTMENT:
      return { ...state, isOpen: action.payload };
    case SET_APPOINTMENT_BY_CUSTOMER:
      return { ...state, appointments: action.payload };
    case CLEAR_APPOINTMENTS:
      return { ...state, appointments: [] };
    case UPDATE_APPOINTMENT_RATING:
      return {
        ...state,
        appointments: state.appointments.map(appointment => (
          appointment.id === action.payload.id ? { ...appointment, rating: action.payload.rating } : appointment
        )),
      };
    default:
      return state;
  }
};

export default appointments;
