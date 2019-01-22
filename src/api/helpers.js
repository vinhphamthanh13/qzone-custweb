import { history } from '../containers/App';

export const handleResponse = (response, defaultResponse) => {
  if (response && response.status === 200) {
    return response.data.objects || response.data.object;
  }

  return defaultResponse;
};

export const handleRequest = async (requestFunc, ...args) => {
  try {
    const request = await requestFunc(...args);
    return request;
  } catch (e) {
    history.push('/access-denied');
    return null;
  }
};
