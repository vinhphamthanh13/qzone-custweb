import { setLoading } from 'actionsReducers/common.actions';
import { getProviderServices, getProviderDetail } from 'actionsApi/provider';
import { handleRequest } from 'utils/apiHelpers';

export const FETCH_PROVIDER_DETAIL = 'PROVIDER.FETCH_PROVIDER_DETAIL';
export const FETCH_PROVIDER_SERVICE = 'PROVIDER.FETCH_PROVIDER_SERVICE';

const setProviderDetail = payload => ({
  type: FETCH_PROVIDER_DETAIL,
  payload,
});

const setProviderService = payload => ({
  type: FETCH_PROVIDER_SERVICE,
  payload,
});

export const fetchProviderService = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [providerServices] = await handleRequest(getProviderServices, [id], null);
  if (providerServices) {
    dispatch(setProviderService(providerServices));
  } else {
    console.log('Error while fetching provider services');
  }
  dispatch(setLoading(false));
};

export const fetchProviderDetail = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [providerDetail] = await handleRequest(getProviderDetail, [id], null);
  if (providerDetail) {
    dispatch(setProviderDetail({ [id]: providerDetail }));
  } else {
    console.log('Error while fetching provider details');
  }
  dispatch(setLoading(false));
};
