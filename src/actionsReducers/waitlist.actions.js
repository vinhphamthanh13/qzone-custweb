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
  validateWaitListsBulk,
} from 'actionsApi/waitlist';

export const REGISTER_WAIT_LIST = 'BOOKING.REGISTER_WAIT_LIST';
export const SET_WAIT_LIST = 'PROFILE.SET_WAIT_LIST';
export const CANCEL_WAIT_LIST = 'PROFILE.CANCEL_WAIT_LIST';
export const VALIDATE_WAIT_LIST = 'BOOKING.VALIDATE_WAIT_LIST';

const setRegisterWaitListStatus = payload => ({
  type: REGISTER_WAIT_LIST,
  payload,
});

const setWaitLists = payload => ({
  type: SET_WAIT_LIST,
  payload,
});

const setCancelWaitLists = payload => ({
  type: CANCEL_WAIT_LIST,
  payload,
});

const setWaitListsValidation = payload => ({
  type: VALIDATE_WAIT_LIST,
  payload,
});

export const registerWaitListsAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [regWaitList, error] = await handleRequest(registerWaitLists, [data]);
  console.log('register waitlist response', regWaitList);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setRegisterWaitListStatus(regWaitList));
    dispatch(setSucceed('Congratulation! Your waitlist is enrolled!'));
  }
  dispatch(setLoading(false));
};

export const setWaitListsAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [waitlists, error] = await handleRequest(waitListsByCustomerId, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setWaitLists(waitlists));
  }
  dispatch(setLoading(false));
};

export const setCancelWaitListsAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [cancelResult, error] = await handleRequest(cancelWaitLists, [data]);
  console.log('cancelResult', cancelResult);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setCancelWaitLists(cancelResult));
    dispatch(setSucceed('Your waitlist is cancelled.'));
  }
  dispatch(setLoading(false));
};

export const setWaitListsValidationAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const validations = await validateWaitListsBulk(data);
  if (!validations) {
    dispatch(setError('There this error when validate temporary services QUEUE'));
  } else {
    const waitListValidation = [];
    validations.map(validation => waitListValidation.push(validation.data));
    dispatch(setWaitListsValidation(waitListValidation));
  }
  dispatch(setLoading(false));
};
