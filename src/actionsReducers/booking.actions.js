import { get } from 'lodash';
import {
  serviceById,
  providersByServiceId,
  availabilitiesBySpecialEventId,
  availabilitiesBySpecialEventIdBulk,
  events,
  temporaryServicesById,
  availabilitiesById,
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
export const SET_AVAILABILITIES_BY_ID = 'BOOKING.SET_AVAILABILITIES_BY_ID';
export const SET_BOOKING_DETAIL = 'BOOKING.SET_BOOKING_DETAIL';
export const SET_APPOINTMENT_CUSTOMER_EVENTS = 'BOOKING.SET_APPOINTMENT_CUSTOMER_EVENTS';
export const SET_BOOKING_STEP = 'BOOKING.SET_BOOKING_STEP';
export const RESET_BOOKING = 'BOOKING.RESET_BOOKING';
export const SET_TEMPORARY_SERVICES_BY_ID = 'BOOKING.SET_TEMPORARY_SERVICES_BY_ID';
export const SET_BOOKED_EVENT_ID = 'BOOKING.SET_BOOKED_EVENT_ID';

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
const setAvailabilitiesById = payload => ({
  type: SET_AVAILABILITIES_BY_ID,
  payload,
});
const setAppointmentCustomerEvents = payload => ({
  type: SET_APPOINTMENT_CUSTOMER_EVENTS,
  payload,
});
const setTemporaryServicesById = payload => ({
  type: SET_TEMPORARY_SERVICES_BY_ID,
  payload,
});

export const setBookingDetail = payload => ({
  type: SET_BOOKING_DETAIL,
  payload,
});

export const setBookingStep = payload => ({
  type: SET_BOOKING_STEP,
  payload,
});

export const resetBooking = () => ({
  type: RESET_BOOKING,
});

export const setBookedEventId = payload => ({
  type: SET_BOOKED_EVENT_ID,
  payload,
});

export const getServiceByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [service, error] = await handleRequest(serviceById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(getServiceById({
      [data]: service,
    }));
  }
  dispatch(setLoading(false));
};

export const setProvidersByServiceIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [providersById, error] = await handleRequest(providersByServiceId, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setProvidersByServiceId({
      [data]: providersById,
    }));
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
  const [availabilitiesBulk, allError] = await availabilitiesBySpecialEventIdBulk(data);
  if (allError) {
    dispatch(setError(get(JSON.parse(allError), 'response.data.message')));
    dispatch(setLoading(false));
  } else {
    const responseBulk = [];
    availabilitiesBulk.map(item => responseBulk.push(...item.data.objects));
    dispatch(setAvailabilitiesBySpecialEventBulk(responseBulk));
    dispatch(setLoading(false));
  }
};

export const setAvailabilitiesByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [availability, error] = await handleRequest(availabilitiesById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAvailabilitiesById(availability));
  }
  dispatch(setLoading(false));
};

export const registerEventAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [registeredEvent, error] = await handleRequest(events, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setAppointmentCustomerEvents(registeredEvent));
    dispatch(setBookedEventId(data.availabilityId));
  }
  dispatch(setLoading(false));
};

export const setTemporaryServicesByIdAction = data => async (dispatch) => {
  dispatch(setLoading(true));
  const [temporaryServiceById, error] = await handleRequest(temporaryServicesById, [data]);
  if (error) {
    dispatch(setError(error));
  } else {
    dispatch(setTemporaryServicesById(temporaryServiceById));
  }
  dispatch(setLoading(false));
};
