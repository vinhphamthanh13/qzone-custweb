export const handleResponse = (response, defaultResponse) => {
  if (response && response.status === 200) {
    console.log('response in handle response', response);
    return response.data;
  }
  return defaultResponse;
};

export const handleError = (response) => {
  console.info('HANDLE ERROR API', response);
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
    console.info('HANDLE REQUEST API::', resp);
    const resolvedResponse = objects || object || resp;
    if (success || resp.length) {
      return [
        resolvedResponse,
        null,
      ];
    }
    console.info('HANDLE REQUEST API 1::', resp);
    return [null, message];
  } catch (e) {
    return [
      null,
      handleError(e.response),
    ];
  }
};

export const handleResponseBulk = response => (Array.isArray(response) ? response.map(item => item.data.object) : []);
