import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  SET_PROVIDERS_BY_SERVICE_ID, RESET_BOOKING, SET_BOOKED_EVENT_ID, SET_BOOKED_EVENT_DETAIL,
} from 'actionsReducers/booking.actions';

const initState = {
  bookedEventId: '',
  bookedEventDetail: {},
  providersByServiceId: {},
};

const persistConfig = {
  key: 'booking',
  storage: storageSession,
  stateReconciler: autoMergeLevel2,
  blacklist: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROVIDERS_BY_SERVICE_ID: {
      const catName = Object.keys(action.payload)[0];
      return {
        ...state,
        providersByServiceId: {
          ...state.providersByServiceId,
          [catName]: {
            ...state.providersByServiceId[catName],
            ...action.payload[catName],
          },
        },
      };
    }
    case SET_BOOKED_EVENT_ID:
      return {
        ...state,
        bookedEventId: action.payload,
      };
    case RESET_BOOKING:
      return {
        ...state,
        bookedEventId: '',
      };
    case SET_BOOKED_EVENT_DETAIL:
      return {
        ...state,
        bookedEventDetail: Object.assign({}, action.payload),
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, reducer);
