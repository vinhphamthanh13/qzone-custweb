import {
  fetchOrganization,
  serviceProviders,
  organizations,
  serviceCategoriesByOrgId,
} from 'actionsApi/organization';
import { handleRequest } from 'utils/apiHelpers';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';

export const SET_ORGANIZATION = 'ORG.SET_ORGANIZATION';
export const SET_SERVICE_PROVIDERS = 'ORG.SET_SERVICE_PROVIDERS';
export const SET_ORGANIZATIONS = 'ORG.SET_ORGANIZATIONS';
export const SET_SERVICE_CATEGORIES_BY_ORG_ID = 'ORG.SET_SERVICE_CATEGORIES_BY_ORG_ID';
export const SET_ORG_NOT_FOUND = 'ORG.SET_ORG_NOT_FOUND';

const setOrganization = payload => ({
  type: SET_ORGANIZATION,
  payload,
});
const setOrganizationsAction = payload => ({
  type: SET_ORGANIZATIONS,
  payload,
});
const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
  payload,
});
export const setOrgNotFoundAction = payload => ({
  type: SET_ORG_NOT_FOUND,
  payload,
});
export const serviceCategoriesByOrgIdAction = payload => ({
  type: SET_SERVICE_CATEGORIES_BY_ORG_ID,
  payload,
});
export const setServiceProvidersAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderList, error] = await handleRequest(serviceProviders, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceProviders(serviceProviderList));
  }
  dispatch(setLoading(false));
};
export const setOrganizationAction = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [organization, error] = await handleRequest(fetchOrganization, [id]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setOrganization(organization));
  }
  dispatch(setLoading(false));
};
export const setOrganizationsApi = () => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(organizations, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setOrganizationsAction(result));
  }
  dispatch(setLoading(false));
};
export const serviceCategoriesByOrgIdApi = id => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(serviceCategoriesByOrgId, [id]);
  if (error) {
    dispatch(setError(error));
    dispatch(setOrgNotFoundAction(true));
  } else {
    dispatch(serviceCategoriesByOrgIdAction(result));
  }
  dispatch(setLoading(false));
};

