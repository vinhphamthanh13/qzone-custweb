import {
  serviceCategories,
  services,
  serviceProviders, serviceProvidersNearBy,
} from 'actionsApi/home';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_SERVICE_PROVIDERS = 'HOME.SET_SERVICE_PROVIDERS';
export const SET_SERVICE_PROVIDER_NEAR_BY = 'HOME.SET_SERVICE_PROVIDER_NEAR_BY';
export const SET_SERVICES_BY_NAME = 'HOME.SET_SERVICES_BY_NAME';

const setServiceCategories = payload => ({
  type: SET_SERVICE_CATEGORIES,
  payload,
});

const setServices = payload => ({
  type: SET_SERVICES,
  payload,
});

const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
  payload,
});

const setServiceProviderNearBy = payload => ({
  type: SET_SERVICE_PROVIDER_NEAR_BY,
  payload,
});

export const setServiceCategoriesAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [categoryList, error] = await handleRequest(serviceCategories, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceCategories(categoryList));
  }
  dispatch(setLoading(false));
};

export const setServicesAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceList, error] = await handleRequest(services, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServices(serviceList));
  }
  dispatch(setLoading(false));
};

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

export const setServiceProviderNearByAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderNearByList, error] = await handleRequest(serviceProvidersNearBy, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceProviderNearBy(serviceProviderNearByList));
  }
  dispatch(setLoading(false));
};
