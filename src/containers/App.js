import React from 'react';
import Alert from 'react-s-alert';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing/app';
import store from 'config/store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import 'config/api';
import './App.module.scss';
import '../styles/_settings.scss';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const history = createBrowserHistory();

const App = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <React.Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              {rootRoutes.map(route => (<Route key={route.path || route.name} {...route} />))}
            </Switch>
          </Router>
        </Provider>
      </MuiPickersUtilsProvider>
      <Alert stack effect="bouncyflip" position="top-right" />
      <CssBaseline />
    </React.Fragment>
  </JssProvider>
);

export default App;
