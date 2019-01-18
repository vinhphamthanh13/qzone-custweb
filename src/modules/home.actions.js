import { searchServicesByName, searchServicesByCategory, searchOrganizationById } from 'api/home';
import { handleResponse, handleRequest } from 'api/helpers';

export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_LOADING = 'HOME.SET_LOADING';
export const SET_ORGS = 'HOME.SET_ORGS';

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

export const setOrgs = payload => ({
  type: SET_ORGS,
  payload,
});

export const getServicesByName = name => async (dispatch) => {
  dispatch(setLoading(true));
  const result = await handleRequest(searchServicesByName, name);
  dispatch(setLoading(false));
  dispatch(setServices(handleResponse(result)));
};

export const getServicesByCategory = categoryId => async (dispatch) => {
  dispatch(setLoading(true));
  const rawServices = handleResponse(await handleRequest(searchServicesByCategory, categoryId), []);
  const orgIds = [];
  rawServices.forEach((service) => {
    if (!orgIds.includes(service.organizationId)) {
      orgIds.push(service.organizationId);
    }
  });
  const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, orgId)));
  const orgs = result.map(handleResponse);
  const services = rawServices.map(
    service => ({ ...service, organization: orgs.find(org => org.id === service.organizationId) }),
  );

  dispatch(setLoading(false));
  dispatch(setServices(services));
  dispatch(setOrgs(orgs));
};
