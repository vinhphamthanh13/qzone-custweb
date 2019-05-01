import { handleRequest } from 'utils/apiHelpers';
import { setLoading, setError } from 'actionsReducers/common.actions';
import { registerWaitList, waitLists } from 'actionsApi/waitlist';


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

export const registerWaitListAction = data => (dispatch) => {
  dispatch(setLoading(true));
  const [regWaitList, error] = handleRequest(registerWaitList, [data]);
  console.log('response after register waitlists', regWaitList);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setRegisterWaitListStatus(regWaitList));
  }
  dispatch(setLoading(false));
};

export const setWaitListsAction = () => (dispatch) => {
  dispatch(setLoading(true));
  const [waitlists, error] = handleRequest(waitLists, []);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setWaitLists(waitlists));
  }
  dispatch(setLoading(false));
};
