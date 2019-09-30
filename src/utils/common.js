import { history } from 'containers/App';
import { get } from 'lodash';

export const navigateTo = (url, state) => () => {
  if (!Object.is(state, null)) {
    history.push(url, state);
  } else {
    history.push(url)
  }
};
export const getLocationState = (location, key) => get(location, `state.${key}`);

export const limitString = (value, length) => {
  const subString = `${value}`.substr(0, length);
  return `${value}`.length > length ? `${subString}...` : value;
};
