import { get } from 'lodash';
import { handleRequest } from 'utils/apiHelpers';
import { findAvailabilitiesByDateRange } from 'actionsApi/home/bookingDialog/selectProvider';
import { setLoading } from 'actionsReducers/common.actions';

export const SET_PROVIDER_SLOTS = 'HOME.SET_PROVIDER_SLOTS';
export const SET_EARLIEST_SLOT = 'HOME.SET_EARLIEST_SLOT';
export const CLEAR_EARLIEST_SLOT = 'HOME.CLEAR_EARLIEST_SLOT';

export const setProviderSlots = payload => ({
  type: SET_PROVIDER_SLOTS,
  payload,
});

export const fetchProviderSlots = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availableSlots] = await handleRequest(findAvailabilitiesByDateRange, [data], []);
  const providerId = get(data, 'providerId');
  const serviceId = get(data, 'serviceId');
  if (availableSlots && availableSlots.length > 0) {
    dispatch(setLoading(false));
    dispatch(setProviderSlots({ [`${serviceId}-${providerId}`]: availableSlots }));
  } else {
    dispatch(setLoading(false));
  }
};

const setEarliestSlot = payload => ({
  type: SET_EARLIEST_SLOT,
  payload,
});

const clearEarliestSlot = () => ({
  type: CLEAR_EARLIEST_SLOT,
});

export const saveEarliestSlot = data => (dispatch) => {
  dispatch(setEarliestSlot(data));
};

export const deleteEarliestSlot = () => (dispatch) => {
  dispatch(clearEarliestSlot());
};
