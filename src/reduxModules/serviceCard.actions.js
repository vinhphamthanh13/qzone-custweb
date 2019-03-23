import { get } from 'lodash';
import { handleRequest } from 'utils/apiHelpers';
import { findAvailabilitiesByDateRange } from 'api/home/bookingDialog/selectProvider';
import { setLoading } from 'actions/common';

export const SET_PROVIDER_SLOTS = 'HOME.SET_PROVIDER_SLOTS';

export const setProviderSlots = payload => ({
  type: SET_PROVIDER_SLOTS,
  payload,
});

export const fetchProviderSlots = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availableSlots] = await handleRequest(findAvailabilitiesByDateRange, [data], []);
  console.log('apin provider slots --> ', availableSlots);
  const providerId = get(data, 'providerId');
  if (availableSlots.length > 0) {
    dispatch(setLoading(false));
    dispatch(setProviderSlots({ [providerId]: availableSlots }));
  } else {
    dispatch(setLoading(false));
  }
};
