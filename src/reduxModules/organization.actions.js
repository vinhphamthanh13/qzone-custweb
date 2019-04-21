
import { setLoading } from 'actionsReducers/common';
import { handleRequest } from 'utils/apiHelpers';
import { fetchOrganization } from 'api/organization';

export const SET_ORGANIZATION = 'ORG.SET_ORGANIZATION';

const setOrganization = payload => ({
  type: SET_ORGANIZATION,
  payload,
});

export const getOrganization = id => async (dispatch) => {
  dispatch(setLoading(true));
  const [organization] = await handleRequest(fetchOrganization, [id], []);
  if (organization) {
    dispatch(setOrganization(organization));
    dispatch(setLoading(false));
  } else {
    dispatch(setLoading(false));
  }
};
