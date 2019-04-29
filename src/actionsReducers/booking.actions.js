import {
  serviceById,
  providersByServiceId,
  availabilitiesBySpecialEventId,
  availabilitiesBySpecialEventIdBulk,
} from 'actionsApi/booking';
import {
  setLoading,
  setError,
} from 'actionsReducers/common.actions';
import { handleRequest } from 'utils/apiHelpers';

export const GET_SERVICE_BY_ID = 'BOOKING.GET_SERVICE_BY_ID';
export const SET_PROVIDERS_BY_SERVICE_ID = 'BOOKING.SET_PROVIDERS_BY_SERVICE_ID';
export const SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID = 'BOOKING.SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID';
export const SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK = 'BOOKING.SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK';
export const SET_BOOKING_STEP = 'BOOKING.SET_BOOKING_STEP';

const getServiceById = payload => ({
  type: GET_SERVICE_BY_ID,
  payload,
});
const setProvidersByServiceId = payload => ({
  type: SET_PROVIDERS_BY_SERVICE_ID,
  payload,
});
const setAvailabilitiesBySpecialEventId = payload => ({
  type: SET_AVAILABILITIES_BY_SPECIAL_EVENT_ID,
  payload,
});
const setAvailabilitiesBySpecialEventBulk = payload => ({
  type: SET_AVAILABILITIES_BY_SPECIAL_EVENT_BULK,
  payload,
});

export const setBookingStepAction = payload => ({
  type: SET_BOOKING_STEP,
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

export const setProvidersByServiceIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [providersById, error] = await handleRequest(providersByServiceId, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProvidersByServiceId(providersById));
  }
  dispatch(setLoading(false));
};

export const setAvailabilitiesBySpecialEventIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availabilities, error] = await handleRequest(availabilitiesBySpecialEventId, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAvailabilitiesBySpecialEventId(availabilities));
  }
  dispatch(setLoading(false));
};

export const setAvailabilitiesBySpecialEventBulkAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const availabilitiesBulk = await availabilitiesBySpecialEventIdBulk(data);
  if (!availabilitiesBulk) {
    dispatch(setError('Cannot fetch all availabilities'));
  } else {
    const responseBulk = [];
    availabilitiesBulk.map(item => responseBulk.push(...item.data.objects));
    dispatch(setAvailabilitiesBySpecialEventBulk(responseBulk));
  }
  dispatch(setLoading(false));
};
