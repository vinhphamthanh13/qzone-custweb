import {
  GET_SERVICE_BY_ID,
  SET_PROVIDERS_BY_SERVICE_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID,
  SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK,
  SET_AVAILABILITIES_BY_ID,
  SET_APPOINTMENT_CUSTOMER_EVENTS,
  SET_BOOKING_DETAIL,
  SET_BOOKING_STEP,
  RESET_BOOKING,
  SET_TEMPORARY_SERVICES_BY_ID,
  SET_BOOKED_EVENT_ID,
} from 'actionsReducers/booking.actions';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const initState = {
  service: null,
  providersByServiceIdList: [],
  availabilities: null,
  availabilitiesBulk: null,
  bookingStep: 0,
  appointmentEvent: null,
  bookingDetail: null,
  availabilitiesById: null,
  bookedEventIdList: [],
};

const persistConfig = {
  key: 'booking',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [
    'appointmentEvent',
    'bookingDetail',
    'bookingStep',
  ],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_SERVICE_BY_ID:
      return {
        ...state,
        service: {
          ...state.service,
          ...action.payload,
        },
      };
    case SET_PROVIDERS_BY_SERVICE_ID:
      return {
        ...state,
        providersByServiceIdList: {
          ...state.providersByServiceIdList,
          ...action.payload,
        },
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
    case SET_AVAILABILITIES_BY_ID:
      return {
        ...state,
        availabilitiesById: action.payload,
      };
    case SET_BOOKING_STEP:
      return {
        ...state,
        bookingStep: action.payload,
      };
    case SET_APPOINTMENT_CUSTOMER_EVENTS:
      return {
        ...state,
        appointmentEvent: action.payload,
      };
    case SET_BOOKING_DETAIL:
      return {
        ...state,
        bookingDetail: action.payload,
      };
    // instant booking will change the flow
    // by mutating the serviceProviders list
    case SET_TEMPORARY_SERVICES_BY_ID:
      return {
        ...state,
        serviceProviders: [action.payload],
      };
    case SET_BOOKED_EVENT_ID:
      return {
        ...state,
        bookedEventIdList: [...state.bookedEventIdList, action.payload],
      };
    case RESET_BOOKING:
      return initState;
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
