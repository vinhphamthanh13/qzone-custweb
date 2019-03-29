import { setLoading } from 'actions/common';
import { rateAppointmentByUser } from 'api/appointment';
import { getProviderServices, getProviderDetail } from 'api/provider';

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
  const providerServices = await getProviderServices(id);
  if (providerServices.data.isAuthenticated) {
    dispatch(setLoading(false));
    dispatch(setProviderService(providerServices.data.objects));
  } else {
    dispatch(setLoading(false));
  }
};

export const fetchProviderDetail = id => async (dispatch) => {
  dispatch(setLoading(true));
  const providerDetail = await getProviderDetail(id);
  if (providerDetail.data.isAuthenticated) {
    dispatch(setLoading(false));
    dispatch(setProviderDetail(providerDetail.data.object));
  } else {
    dispatch(setLoading(false));
  }
};

export const setRatingService = data => async (dispatch) => {
  dispatch(setLoading(true));
  await rateAppointmentByUser(data);
  dispatch(setLoading(false));
};
