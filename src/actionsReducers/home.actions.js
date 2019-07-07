import {
  serviceCategories,
  services,
  serviceProvidersNearBy,
} from 'actionsApi/home';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
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

const setServiceProviderNearBy = payload => ({
  type: SET_SERVICE_PROVIDER_NEAR_BY,
  payload,
});

export const setServiceCategoriesAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [categoryList, error] = await handleRequest(serviceCategories, []);
  if ((categoryList && !categoryList.success) || error) {
    dispatch(setError(categoryList.message || error));
  } else {
    dispatch(setServiceCategories(categoryList));
  }
  dispatch(setLoading(false));
};

export const setServicesAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceList, error] = await handleRequest(services, []);
  if ((serviceList && !serviceList.success) || error) {
    dispatch(setError(serviceList.message || error));
  } else {
    dispatch(setServices(serviceList));
  }
  dispatch(setLoading(false));
};

export const setServiceProviderNearByAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [serviceProviderNearByList, error] = await handleRequest(serviceProvidersNearBy, [data]);
  if ((serviceProviderNearByList && !serviceProviderNearByList.success) || error) {
    dispatch(setError(serviceProviderNearByList.message || error));
  } else {
    dispatch(setServiceProviderNearBy(serviceProviderNearByList));
  }
  dispatch(setLoading(false));
};
