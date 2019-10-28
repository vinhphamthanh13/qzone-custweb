import { get } from 'lodash';
import moment from 'moment';
import { handleRequest } from 'utils/apiHelpers';
import {
  setLoading,
  setError,
  setSucceed,
} from 'actionsReducers/common.actions';
import {
  registerWaitLists,
  waitListsByCustomerId,
  cancelWaitLists,
  waitListsById,
} from 'actionsApi/waitlist';
import { CALENDAR_DATE, regExPattern, timeSlotFormat } from 'utils/constants';

export const REGISTER_WAIT_LISTS = 'BOOKING.REGISTER_WAIT_LISTS';
export const SET_WAIT_LISTS = 'PROFILE.SET_WAIT_LISTS';
export const SET_WAIT_LISTS_BY_ID = 'BOOKING.SET_WAIT_LISTS_BY_ID';
export const CANCEL_WAIT_LISTS = 'PROFILE.CANCEL_WAIT_LISTS';
export const RESET_REGISTER_WAIT_LISTS_STATUS = 'BOOKING.RESET_REGISTER_WAIT_LISTS_STATUS';
const setWaitListsAction = payload => ({
  type: SET_WAIT_LISTS,
  payload,
});
const setWaitListsByIdAction = payload => ({
  type: SET_WAIT_LISTS_BY_ID,
  payload,
});
const setCancelWaitListsAction = payload => ({
  type: CANCEL_WAIT_LISTS,
  payload,
});
export const registerWaitListsApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(registerWaitLists, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    const timezoneId = get(result, 'timezoneId');
    const enrolledDate = get(result, 'sstartTime').replace(
      regExPattern.ISO_TIME.pattern, regExPattern.ISO_TIME.replaceBy,
      );
    dispatch(setSucceed(
      // eslint-disable-next-line max-len
      `You have been enrolled the event on ${moment(enrolledDate).format(CALENDAR_DATE)} at ${moment(enrolledDate).format(timeSlotFormat)}! (${timezoneId})`,
    ));
    dispatch(setLoading(false));
  }
  dispatch(setLoading(false));
};

export const setWaitListsApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(waitListsByCustomerId, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setWaitListsAction(result));
  }
  dispatch(setLoading(false));
};
export const setWaitListsByIdApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [result, error] = await handleRequest(waitListsById, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setWaitListsByIdAction(result));
  }
  dispatch(setLoading(false));
};
export const setCancelWaitListsApi = (data, headers) => async (dispatch) => {
  dispatch(setLoading(true));
  const [, error] = await handleRequest(cancelWaitLists, [data, headers]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setCancelWaitListsAction(data));
    dispatch(setSucceed('Your waitlist is cancelled.'));
  }
  dispatch(setLoading(false));
};
