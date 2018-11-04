import React from 'react';
import Alert from 'react-s-alert';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing/app';
import store from 'config/store';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import './App.scss';

const history = createBrowserHistory();

const App = () => (
  <React.Fragment>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            {rootRoutes.map(route => (<Route key={route.path} {...route} />))}
          </Switch>
        </Router>
      </Provider>
    </MuiPickersUtilsProvider>
    <Alert stack effect="bouncyflip" position="top-right" />
    <CssBaseline />
  </React.Fragment>
);

export default App;
