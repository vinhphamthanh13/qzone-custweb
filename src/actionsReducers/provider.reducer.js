import {
  SET_PROVIDER_DETAIL,
  SET_PROVIDER_SERVICE,
  TEMPORARY_SERVICES_BY_SERVICE_ID,
  AVAILABILITIES_BY_TMP_SERVICE_ID,
  INSTANT_AVAILABILITIES_BY_TMP_SERVICE_ID,
  SELECT_BOOKING_DETAIL,
} from 'actionsReducers/provider.actions';

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const initState = {
  providerDetail: null,
  providerServices: null,
  temporaryServiceByServiceIds: {},
  availabilitiesByTemporaryServiceId: {},
  instantAvailabilitiesByTemporaryServiceId: [],
  selectedBookingDetail: {},
};
const persistConfig = {
  key: 'provider',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: [],
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
    case SELECT_BOOKING_DETAIL:
      return {
        ...state,
        selectedBookingDetail: action.payload,
      };
    default:
      return { ...state };
  }
};

export default persistReducer(persistConfig, reducer);
