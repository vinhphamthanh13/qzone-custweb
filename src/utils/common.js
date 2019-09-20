import { history } from 'containers/App';

export const navigateTo = url => () => history.push(url);
export const limitString = (value, length) => {
  const subString = `${value}`.substr(0, length);
  return `${subString}...`;
};
