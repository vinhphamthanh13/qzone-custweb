import { handleRequest } from 'utils/apiHelpers';
import {
  setLoading,
  setError,
  setSucceed,
} from 'actionsReducers/common.actions';
import {
  registerWaitLists,
  waitListsByCustomerId,
} from 'actionsApi/waitlist';


export const REGISTER_WAIT_LIST = 'PROFILE.REGISTER_WAIT_LIST';
export const SET_WAIT_LIST = 'PROFILE.SET_WAIT_LIST';

export const setRegisterWaitListStatus = payload => ({
  type: REGISTER_WAIT_LIST,
  payload,
});

export const setWaitLists = payload => ({
  type: SET_WAIT_LIST,
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
    dispatch(setSucceed('You have been registered the waitlist successfully.'));
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
