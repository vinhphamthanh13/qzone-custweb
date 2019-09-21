import { history } from 'containers/App';

export const navigateTo = (url, state) => () => {
  if (!Object.is(state, null)) {
    history.push(url, state);
  } else {
    history.push(url)
  }
};
export const limitString = (value, length) => {
  const subString = `${value}`.substr(0, length);
  return `${subString}...`;
};
