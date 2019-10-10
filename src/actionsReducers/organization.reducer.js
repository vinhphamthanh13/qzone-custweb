import {
  SET_ORGANIZATION,
  SET_SERVICE_PROVIDERS,
  SET_ORGANIZATIONS,
  SET_SERVICE_CATEGORIES_BY_ORG_ID,
} from './organization.actions';

const initState = {
  serviceProviders: null,
  organization: null,
  organizations: [],
  serviceCategoriesByOrgId: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case SET_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
      };
    case SET_SERVICE_PROVIDERS:
      return {
        ...state,
        serviceProviders: action.payload,
      };
    case SET_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case SET_SERVICE_CATEGORIES_BY_ORG_ID:
      return {
        ...state,
        serviceCategoriesByOrgId: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
