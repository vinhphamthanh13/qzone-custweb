import {
  searchServicesByName, searchServicesByCategory, searchOrganizationById, getServices, getCustomerEvents,
  searchByDistance, getServiceProviders,
} from 'api/home';
import { handleRequest } from 'utils/apiHelpers';

export const SET_ALL_SERVICES = 'HOME.SET_ALL_SERVICES';
export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_LOADING = 'HOME.SET_LOADING';
export const SET_ORGS = 'HOME.SET_ORGS';
export const GET_CUSTOMER_EVENT_LIST = 'GET_CUSTOMER_EVENT_LIST';
export const SEARCH_PROVIDER_BY_DISTANCE = 'SEARCH_PROVIDER_BY_DISTANCE';
export const SET_SERVICE_PROVIDERS = 'SET_SERVICE_PROVIDERS';

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

const setServiceProviders = payload => ({
  type: SET_SERVICE_PROVIDERS,
  payload,
});

export const fetchServiceProviders = () => async (dispatch) => {
  dispatch(setLoading(true));
  const providerList = await handleRequest(getServiceProviders, [], []);
  if (providerList.length > 0) {
    dispatch(setServiceProviders(providerList[0]));
    dispatch(setLoading(false));
  } else {
    dispatch(setLoading(false));
  }
};

export const getServicesByName = name => async (dispatch) => {
  dispatch(setLoading(true));
  const [result] = await handleRequest(searchServicesByName, [name], []);
  dispatch(setLoading(false));
  dispatch(setServices(result));
};

export const getServicesByCategory = categoryId => async (dispatch) => {
  dispatch(setLoading(true));
  const [rawServices] = await handleRequest(searchServicesByCategory, [categoryId], []);
  const orgIds = [];
  rawServices.forEach((service) => {
    if (!orgIds.includes(service.organizationId)) {
      orgIds.push(service.organizationId);
    }
  });
  const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, [orgId])));
  const orgs = result.map(org => org[0]);
  const services = rawServices.map(
    service => ({ ...service, organization: orgs.find(org => org.id === service.organizationId) }),
  );

  dispatch(setLoading(false));
  dispatch(setServices(services));
  dispatch(setOrgs(orgs));
};

const setAllServices = payload => ({
  type: SET_ALL_SERVICES,
  payload,
});

export const getAllServices = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [rawServices] = await handleRequest(getServices, [], []);
  const orgIds = [];
  rawServices.forEach((service) => {
    if (!orgIds.includes(service.organizationId)) {
      orgIds.push(service.organizationId);
    }
  });
  const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, [orgId])));
  const orgs = result.map(org => org[0]);
  const services = rawServices.map(
    service => ({ ...service, organization: orgs.find(org => org.id === service.organizationId) }),
  );
  dispatch(setAllServices(services));
  dispatch(setOrgs(orgs));
  dispatch(setLoading(false));
};

export const setServicesGlobal = (categoryId = '') => async (dispatch) => {
  dispatch(setLoading(true));
  const [api, save] = categoryId ? [searchServicesByCategory, setServices] : [getServices, setAllServices];
  const [rawServices] = await handleRequest(api, [categoryId], []);
  const orgIds = [];
  if (rawServices && rawServices.length) {
    rawServices.forEach((service) => {
      if (!orgIds.includes(service.organizationId)) {
        orgIds.push(service.organizationId);
      }
    });
    const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, [orgId])));
    const orgs = result.map(org => org[0]).filter(org => !Object.is(org, undefined));
    const services = rawServices.map(
      service => ({
        ...service,
        organization: orgs.filter(org => !Object.is(org, undefined))
          .find(org => org.id === service.organizationId),
      }),
    );

    dispatch(setLoading(false));
    dispatch(save(services));
    dispatch(setOrgs(orgs));
  } else {
    dispatch(setLoading(false));
  }
};

const getCustomerEventList = payload => ({
  type: GET_CUSTOMER_EVENT_LIST,
  payload,
});

export const fetchCustomerEvents = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [eventList] = await handleRequest(getCustomerEvents, [id], []);
  dispatch(getCustomerEventList(eventList));
  dispatch(setLoading(false));
};

const getProviderByDistance = payload => ({ type: SEARCH_PROVIDER_BY_DISTANCE, payload });

export const searchProviderByDistance = data => async (dispatch) => {
  dispatch(setLoading(true));
  const providerList = await handleRequest(searchByDistance, [data], []);
  dispatch(getProviderByDistance(providerList[0]));
  dispatch(setLoading(false));
};
