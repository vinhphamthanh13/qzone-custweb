import { setLoading } from 'actions/common';
import { getProvider } from 'api/provider';

export const FETCH_PROVIDER_DETAIL = 'PROVIDER.FETCH_PROVIDER_DETAIL';

const setProviderDetail = payload => ({
  type: FETCH_PROVIDER_DETAIL,
  payload,
});

export const fetchProvider = id => async (dispatch) => {
  dispatch(setLoading(true));
  const providerDetail = await getProvider(id);
  console.log('providerDetails', providerDetail);
  if (providerDetail.data.isAuthenticated) {
    dispatch(setLoading(false));
    dispatch(setProviderDetail(providerDetail.data.objects));
  } else {
    dispatch(setLoading(false));
  }
};
