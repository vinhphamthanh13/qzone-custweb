import { events, waitlistConfirm } from 'actionsApi/booking';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

// Decoupling
export const SET_BOOKED_EVENT_ID = 'BOOKING.SET_BOOKED_EVENT_ID';
export const SET_BOOKED_EVENT_DETAIL = 'BOOKING.SET_BOOKED_EVENT_DETAIL';
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
