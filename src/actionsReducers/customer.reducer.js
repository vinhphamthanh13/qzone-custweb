import { TRACKING_APPOINTMENT } from 'actionsReducers/customer.actions';

const initState = {
  trackingAppointmentById: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case TRACKING_APPOINTMENT:
      return {
        ...state,
        trackingAppointmentById: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
