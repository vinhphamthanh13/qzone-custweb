import { serviceById } from 'actionsApi/booking';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const GET_SERVICE_BY_ID = 'BOOKING.GET_SERVICE_BY_ID';

const getServiceById = payload => ({
  type: GET_SERVICE_BY_ID,
  payload,
});

export const getServiceByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [service, error] = await handleRequest(serviceById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(getServiceById(service));
  }
  dispatch(setLoading(false));
};
