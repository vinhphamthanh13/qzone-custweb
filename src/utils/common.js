import { history } from 'containers/App';

export const handlePushLocation = url => () => history.push(url);
