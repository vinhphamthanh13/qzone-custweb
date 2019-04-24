// import {
//   // searchServicesByName,
//   // findEventByCustomerId,
//   // fetchServiceProviderById,
// } from 'actionsApi/home';
// import { handleRequest } from 'utils/apiHelpers';

export const SET_ALL_SERVICES = 'HOME.SET_ALL_SERVICES';
export const SET_SERVICE_CATEGORIES = 'HOME.SET_SERVICE_CATEGORIES';
export const SET_SERVICES = 'HOME.SET_SERVICES';
export const SET_LOADING = 'HOME.SET_LOADING';
export const SET_ORGS = 'HOME.SET_ORGS';
export const GET_CUSTOMER_EVENT_LIST = 'GET_CUSTOMER_EVENT_LIST';
export const SEARCH_PROVIDER_BY_DISTANCE = 'SEARCH_PROVIDER_BY_DISTANCE';
export const SET_SERVICE_PROVIDERS = 'SET_SERVICE_PROVIDERS';
export const SET_SERVICE_PROVIDER_BY_ID = 'HOME.SET_SERVICE_PROVIDER_BY_ID';

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

// const setServiceProviders = payload => ({
//   type: SET_SERVICE_PROVIDERS,
//   payload,
// });

// export const fetchServiceProviders = () => async (dispatch) => {
//   dispatch(setLoading(true));
//   const providerList = await handleRequest(getServiceProviders, [], []);
//   if (providerList.length > 0) {
//     dispatch(setServiceProviders(providerList[0]));
//     dispatch(setLoading(false));
//   } else {
//     dispatch(setLoading(false));
//   }
// };
//
// export const getServicesByName = name => async (dispatch) => {
//   dispatch(setLoading(true));
//   const [result] = await handleRequest(searchServicesByName, [name], []);
//   dispatch(setLoading(false));
//   dispatch(setServices(result));
// };

//
// const getCustomerEventList = payload => ({
//   type: GET_CUSTOMER_EVENT_LIST,
//   payload,
// });
//
// const saveServiceProviderById = payload => ({
//   type: SET_SERVICE_PROVIDER_BY_ID,
//   payload,
// });
//
// export const fetchServiceProviderByIdAction = id => async (dispatch) => {
//   dispatch(setLoading(true));
//   const [serviceProvider] = await handleRequest(fetchServiceProviderById, [id], null);
//   if (!serviceProvider) {
//     console.log('error');
//   } else {
//     dispatch(saveServiceProviderById(serviceProvider));
//   }
//   dispatch(setLoading(false));
// };
