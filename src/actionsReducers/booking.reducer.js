import {
  GET_SERVICE_BY_ID,
  SET_PROVIDERS_BY_SERVICE_ID,
} from 'actionsReducers/booking.actions';

const initState = {
  service: null,
  providersByServiceIdList: null,
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_SERVICE_BY_ID:
      return {
        ...state,
        service: action.payload,
      };
    case SET_PROVIDERS_BY_SERVICE_ID:
      return {
        ...state,
        providersByServiceIdList: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
