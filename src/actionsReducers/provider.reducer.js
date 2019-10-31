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
  TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID,
  SET_SERVICE_DATE_PROVIDERS,
  SET_PROVIDERS_BY_ORG_REF,
  CLEAR_PROVIDERS_BY_ORG_REF,
  CLEAR_TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID,
  SET_BOOK_NOW,
  CLEAR_BOOK_NOW,
  QUERY_AVAILABILITIES_BY_DATE,
} from 'actionsReducers/provider.actions';

const initState = {
  providerDetail: null,
  providerServices: null,
  temporaryServiceByServiceIds: {},
  availabilitiesByTemporaryServiceId: {},
  queryAvailabilitiesByTemporaryServiceId: {},
  instantAvailabilitiesByTemporaryServiceId: [],
  rescheduledAvailabilitiesByTemporaryServiceId: [],
  selectedBookingDetail: {},
  providerById: {},
  waitListTemporaryServicesByServiceId: [],
  queriedProvider: null,
  tempServiceDateProvider: {},
  serviceDateProviders: [],
  providersByServiceId: {},
  providersByOrgRef: {},
  bookNowList: {},
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
    case TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID: {
      return {
        ...state,
        tempServiceDateProvider: {
            ...state.tempServiceDateProvider,
          ...action.payload,
        },
      };
    }
    case CLEAR_TEMP_SERVICE_DATE_PROVIDER_BY_SERVICE_ID: {
      return {
        ...state,
        tempServiceDateProvider: {},
      };
    }
    case SET_BOOK_NOW:
      return {
        ...state,
        bookNowList: {
          ...state.bookNowList,
          ...action.payload,
        },
      };
    case CLEAR_BOOK_NOW:
      return {
        ...state,
        bookNowList: {},
      };
    case SET_SERVICE_DATE_PROVIDERS:
      return {
        ...state,
        serviceDateProviders: [...action.payload ],
      };
    case SET_PROVIDERS_BY_ORG_REF:
      return {
        ...state,
        providersByOrgRef: {
          ...state.providersByOrgRef,
          ...action.payload,
        },
      };
    case CLEAR_PROVIDERS_BY_ORG_REF:
      return {
        ...state,
        providersByOrgRef: {},
      };
    case AVAILABILITIES_BY_TMP_SERVICE_ID:
      return {
        ...state,
        availabilitiesByTemporaryServiceId: {
          ...state.availabilitiesByTemporaryServiceId,
          ...action.payload,
        },
      };
    case QUERY_AVAILABILITIES_BY_DATE:
      return {
        ...state,
        queryAvailabilitiesByTemporaryServiceId: action.payload,
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
        queriedProvider: action.payload.serviceDateProviders,
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
