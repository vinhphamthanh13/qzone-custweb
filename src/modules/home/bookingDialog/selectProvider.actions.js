import { handleResponse } from 'api/helpers';
import {
  searchProvidersByService,
  searchProviderById,
  findAvailabilitiesByDateSec,
} from 'api/home/bookingDialog/selectProvider';
import { searchOrganizationById } from 'api/home';
import { setOrgs } from 'modules/home.actions';
import { handleRequest } from '../../../api/helpers';

export const SET_LOADING = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_LOADING';
export const SET_PROVIDERS = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_PROVIDERS';
export const SET_PROVIDER_TIME_DETAIL = 'HOME.BOOKING_DIALOG.SELECT_SERVICE.SET_PROVIDER_TIME_DETAIL';

export const setLoading = payload => ({
  type: SET_LOADING,
  payload,
});

export const setProviders = payload => ({
  type: SET_PROVIDERS,
  payload,
});

export const setProviderTimeDetail = (providerId, providerTimeDetail) => ({
  type: SET_PROVIDER_TIME_DETAIL,
  payload: { providerId, providerTimeDetail },
});

export const getProvidersByService = serviceId => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const rawProvidersService = handleResponse(await handleRequest(searchProvidersByService, serviceId), []);
  const response = await Promise.all(rawProvidersService.map(
    resp => handleRequest(searchProviderById, resp.providerId),
  ));
  const rawProviders = response.map(handleResponse);
  const orgIds = [];
  const { home } = getState();
  rawProviders.forEach((provider) => {
    if (!orgIds.includes(provider.organizationId) && !home.orgs.find(org => org.id === provider.organizationId)) {
      orgIds.push(provider.organizationId);
    }
  });
  const result = await Promise.all(orgIds.map(orgId => handleRequest(searchOrganizationById, orgId)));
  const orgs = result.map(handleResponse).concat(home.orgs);
  const providers = rawProviders.map(
    provider => ({ ...provider, organization: orgs.find(org => org.id === provider.organizationId) }),
  );

  dispatch(setLoading(false));
  dispatch(setProviders(providers));
  dispatch(setOrgs(orgs));
};

export const getProviderTime = ({ serviceId, providerId, startSec }) => async (dispatch) => {
  dispatch(setLoading(true));
  const response = handleResponse(await findAvailabilitiesByDateSec({ serviceId, providerId, startSec }));
  dispatch(setProviderTimeDetail(providerId, response));
  dispatch(setLoading(false));
};
