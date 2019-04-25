import { GET_SERVICE_BY_ID } from 'actionsReducers/booking.actions';

const initState = {
  service: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_SERVICE_BY_ID:
      return {
        ...state,
        service: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
