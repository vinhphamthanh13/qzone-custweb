import { handleRequest } from 'utils/apiHelpers';
import { setLoading } from 'actionsReducers/common.actions';
import { registerWaitList, fetchWaitList } from 'api/waitlist';


export const REGISTER_WAITLIST = 'PROFILE.REGISTER_WAITLIST';
export const FETCH_WAITLIST = 'PROFILE.FETCH_WAITLIST';

export const setRegisterWaitListStatus = payload => ({
  type: REGISTER_WAITLIST,
  payload,
});

export const setWaitList = payload => ({
  type: FETCH_WAITLIST,
  payload,
});

export const registerWaitListAction = data => (dispatch) => {
  dispatch(setLoading(true));
  const [response] = handleRequest(registerWaitList, [data], null);
  console.log('response after register waitlist', response);
  if (response) {
    dispatch(setRegisterWaitListStatus('success'));
  } else {
    dispatch(setRegisterWaitListStatus('error'));
  }
  dispatch(setLoading(false));
};

export const fetchWaitListAction = () => (dispatch) => {
  dispatch(setLoading(true));
  const [response] = handleRequest(fetchWaitList, [], null);
  console.log('fetchWaitList', response);
  if (response) {
    dispatch(setLoading(false));
    dispatch(setWaitList(response));
  } else {
    console.log('error when getting waitlist');
  }
  dispatch(setLoading(false));
};
