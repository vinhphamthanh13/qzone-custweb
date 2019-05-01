import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import { initializeFirebase } from 'utils/pushNotification';
import registerServiceWorker from 'utils/serviceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
registerServiceWorker();
initializeFirebase();
