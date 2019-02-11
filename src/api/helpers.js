import { history } from '../containers/App';

export const handleResponse = (response, defaultResponse) => {
  if (response && response.status === 200) {
    return response.data.objects || response.data.object;
  }

  return defaultResponse;
};

export const handleRequest = async (requestFunc, ...args) => {
  try {
    return await requestFunc(...args);
  } catch (e) {
    history.push('/access-denied');
    return null;
  }
};
