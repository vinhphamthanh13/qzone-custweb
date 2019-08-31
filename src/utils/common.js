import { history } from 'containers/App';

export const handlePushLocation = url => () => history.push(url);

export const createHeaders = token => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
    Accept: 'application/json',
  },
});
