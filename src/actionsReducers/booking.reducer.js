import {
  GET_SERVICE_BY_ID,
  SET_PROVIDERS_BY_SERVICE_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK,
} from 'actionsReducers/booking.actions';

const initState = {
  service: null,
  providersByServiceIdList: null,
  availabilities: null,
  availabilitiesBulk: null,
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
    case SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID:
      return {
        ...state,
        availabilities: action.payload,
      };
    case SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK:
      return {
        ...state,
        availabilitiesBulk: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
