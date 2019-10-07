import {
  events,
  fetchProvidersByServiceId,
  waitlistConfirm,
} from 'actionsApi/booking';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const SET_PROVIDERS_BY_SERVICE_ID = 'BOOKING.SET_PROVIDERS_BY_SERVICE_ID';
export const SET_BOOKING_DETAIL = 'BOOKING.SET_BOOKING_DETAIL';
export const SET_BOOKING_STEP = 'BOOKING.SET_BOOKING_STEP';
export const RESET_BOOKING = 'BOOKING.RESET_BOOKING';
// Decoupling
export const SET_BOOKED_EVENT_ID = 'BOOKING.SET_BOOKED_EVENT_ID';
export const SET_BOOKED_EVENT_DETAIL = 'BOOKING.SET_BOOKED_EVENT_DETAIL';
const providersByServiceIdAction = payload => ({
  type: SET_PROVIDERS_BY_SERVICE_ID,
  payload,
});
export const setBookingDetail = payload => ({
  type: SET_BOOKING_DETAIL,
  payload,
});
export const setBookingStep = payload => ({
  type: SET_BOOKING_STEP,
  payload,
});
export const providersByServiceIdApi = (sId, sName, catName) => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(fetchProvidersByServiceId, [sId]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(providersByServiceIdAction({ [catName]: { [sName]: result } }));
  }
  dispatch(setLoading(false));
};
// Decoupling
const bookEventAction = payload => ({
  type: SET_BOOKED_EVENT_DETAIL,
  payload,
});
const bookEventIdAction = payload => ({
  type: SET_BOOKED_EVENT_ID,
  payload,
});
export const bookEventApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(events, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(bookEventAction(result));
    dispatch(bookEventIdAction(data.availabilityId));
  }
  dispatch(setLoading(false));
};
export const confirmWaitListsApi = data => async dispatch => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(waitlistConfirm, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(bookEventAction(result));
    dispatch(bookEventIdAction(data.availabilityId));
  }
  dispatch(setLoading(false));
};
