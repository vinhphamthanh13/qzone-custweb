import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {
  SET_PROVIDER_DETAIL,
  SET_PROVIDER_SERVICE,
  TEMPORARY_SERVICES_BY_SERVICE_ID,
  AVAILABILITIES_BY_TMP_SERVICE_ID,
  INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID,
  RESCHEDULE_AVAILABILITIES_BY_TMP_SERVICE_ID,
  SELECT_BOOKING_DETAIL,
  USERS_BY_ID,
  WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID,
  QUERY_PROVIDER,
  CLEAR_QUERIED_PROVIDER,
  CLEAR_SELECT_BOOKING_DETAIL,
} from 'actionsReducers/provider.actions';

const initState = {
  providerDetail: null,
  providerServices: null,
  temporaryServiceByServiceIds: {},
  availabilitiesByTemporaryServiceId: {},
  instantAvailabilitiesByTemporaryServiceId: [],
  rescheduledAvailabilitiesByTemporaryServiceId: [],
  selectedBookingDetail: {},
  providerById: {},
  waitListTemporaryServicesByServiceId: [],
  queriedProvider: null,
};
const persistConfig = {
  key: 'provider',
  storage: storageSession,
  stateReconciler: autoMergeLevel2,
  blacklist: ['instantAvailabilitiesByTemporaryServiceId', 'providerById'],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_PROVIDER_SERVICE:
      return {
        ...state,
        providerServices: action.payload,
      };
    case SET_PROVIDER_DETAIL:
      return {
        ...state,
        providerDetail: {
          ...state.providerDetail,
          ...action.payload,
        },
      };
    case USERS_BY_ID:
      return {
        ...state,
        providerById: action.payload,
      };
    case TEMPORARY_SERVICES_BY_SERVICE_ID:
      return {
        ...state,
        temporaryServiceByServiceIds: {
          ...state.temporaryServiceByServiceIds,
          ...action.payload,
        },
      };
    case AVAILABILITIES_BY_TMP_SERVICE_ID:
      return {
        ...state,
        availabilitiesByTemporaryServiceId: {
          ...state.availabilitiesByTemporaryServiceId,
          ...action.payload,
        },
      };
    case INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID:
      return {
        ...state,
        instantAvailabilitiesByTemporaryServiceId: action.payload,
      };
    case RESCHEDULE_AVAILABILITIES_BY_TMP_SERVICE_ID:
      return {
        ...state,
        rescheduledAvailabilitiesByTemporaryServiceId: action.payload,
      };
    case SELECT_BOOKING_DETAIL:
      return {
        ...state,
        selectedBookingDetail: action.payload,
      };
    case CLEAR_SELECT_BOOKING_DETAIL:
      return {
        ...state,
        selectedBookingDetail: {},
      };
    case QUERY_PROVIDER:
      return {
        ...state,
        queriedProvider: action.payload,
      };
    case CLEAR_QUERIED_PROVIDER:
      return {
        ...state,
        queriedProvider: null,
      };
    case WAIT_LIST_TEMPORARY_SERVICES_BY_SERVICE_ID:
      return {
        ...state,
        waitListTemporaryServicesByServiceId: action.payload,
      };
    default:
      return { ...state };
  }
};

export default persistReducer(persistConfig, reducer);
