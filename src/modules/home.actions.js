import { searchServicesByName, searchServicesByCategory } from 'api/home';
import { handleResponse } from 'api/helpers';

export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_LOADING = 'HOME.SET_LOADING';

export const setServiceCategories = payload => ({
  type: SET_SERVICE_CATEGORIES,
  payload,
});

export const setServices = payload => ({
  type: SET_SERVICES,
  payload,
});

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const getServicesByName = name => async (dispatch) => {
  dispatch(setLoading(true));
  const result = await searchServicesByName(name);
  dispatch(setLoading(false));
  dispatch(setServices(handleResponse(result)));
};

export const getServicesByCategory = categoryId => async (dispatch) => {
  dispatch(setLoading(true));
  const result = await searchServicesByCategory(categoryId);
  dispatch(setLoading(false));
  dispatch(setServices(handleResponse(result)));
};
