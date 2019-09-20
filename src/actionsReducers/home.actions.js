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

const setServiceCategoriesAction = payload => ({
  type: SET_SERVICE_CATEGORIES,
  payload,
});

const setServicesAction = payload => ({
  type: SET_SERVICES,
  payload,
});

const setServiceProviderNearBy = payload => ({
  type: SET_SERVICE_PROVIDER_NEAR_BY,
  payload,
});

export const setServiceCategories = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [categoryList, error] = await handleRequest(serviceCategories, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServiceCategoriesAction(categoryList));
  }
  dispatch(setLoading(false));
};

export const setServices = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(services, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setServicesAction(result));
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
