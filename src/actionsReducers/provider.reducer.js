import {
  SET_PROVIDER_DETAIL,
  SET_PROVIDER_SERVICE,
  TEMPORARY_SERVICES_BY_SERVICE_ID,
  AVAILABILITIES_BY_TMP_SERVICE_ID,
} from 'actionsReducers/provider.actions';

const initState = {
  providerDetail: null,
  providerServices: null,
  temporaryServiceByServiceIds: [],
  availabilitiesByTemporaryServiceId: {},
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
        temporaryServiceByServiceIds: action.payload,
      };
    case AVAILABILITIES_BY_TMP_SERVICE_ID:
      return {
        ...state,
        availabilitiesByTemporaryServiceId: {
          ...state.availabilitiesByTemporaryServiceId,
          ...action.payload,
        },
      };
    default:
      return { ...state };
  }
};

export default reducer;
