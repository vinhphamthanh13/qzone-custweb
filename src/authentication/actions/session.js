import { LOAD_SESSION_TO_STATE } from './constants';

export const loadSessionToState = payload => ({
  type: LOAD_SESSION_TO_STATE,
  payload,
});
