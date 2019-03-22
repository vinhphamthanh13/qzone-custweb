
import { setLoading } from 'actions/common';
import { handleRequest } from 'utils/apiHelpers';
import { getOrgs } from 'api/organisation';

export const SET_ORG = 'ORG.GET_ORG';

const setOrgs = payload => ({
  type: SET_ORG,
  payload,
});

export const fetchOrg = id => async (dispatch) => {
  dispatch(setLoading(true));
  const orgs = await handleRequest(getOrgs, [id], []);
  if (orgs.length > 0) {
    dispatch(setOrgs(orgs));
    dispatch(setLoading(false));
  }
};
