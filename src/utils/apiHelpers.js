import { isEmpty } from 'lodash';

export const handleResponse = (response, defaultResponse) => {
  if (response && response.status === 200) {
    return response.data;
  }
  return defaultResponse;
};
export const handleError = (response) => {
  if (response && response.data) {
    return response.data.message;
  }
  return 'Cannot connect to services';
};
export const handleRequest = async (requestFunc, args, defaultResponse) => {
  try {
    const resp = handleResponse(await requestFunc(...args), defaultResponse);
    const {
      success,
      message,
      objects,
      object,
    } = resp;
    const resolvedResponse = objects || object;
    if (success || !isEmpty(resolvedResponse)) {
      return [
        resolvedResponse,
        null,
      ];
    }
    return [null, message || 'Your request is unavailable!'];
  } catch (e) {
    return [
      null,
      handleError(e.response),
    ];
  }
};
export const handleResponseBulk = response => (Array.isArray(response) ? response.map(item => item.data.object) : []);
export const createHeaders = token => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
  },
});
