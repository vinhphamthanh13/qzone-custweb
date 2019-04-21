import {
  serviceCategories,
  services,
  serviceProviders,
} from 'api/home';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_SERVICE_PROVIDERS = 'HOME.SET_SERVICE_PROVIDERS';

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
