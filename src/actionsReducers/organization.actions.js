import {
  fetchOrganization,
  serviceProviders,
} from 'actionsApi/organization';
import { handleRequest } from 'utils/apiHelpers';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';

export const SET_ORGANIZATION = 'ORG.SET_ORGANIZATION';
export const SET_SERVICE_PROVIDERS = 'ORG.SET_SERVICE_PROVIDERS';

const setOrganization = payload => ({
  type: SET_ORGANIZATION,
  payload,
});

const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
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
