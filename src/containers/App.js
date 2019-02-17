import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing/app';
import store from 'config/store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Amplify from 'aws-amplify';
import 'config/api';
import { AWS_CONFIG } from 'config/auth';
import Loading from 'components/Modal/Loading';
import './App.module.scss';
import '../styles/_settings.scss';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const history = createBrowserHistory();

Amplify.configure(AWS_CONFIG);

const App = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <React.Fragment>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              {rootRoutes.map(route => (<Route key={route.path || route.name} {...route} />))}
            </Switch>
          </Router>
          <Loading />
        </Provider>
      </MuiPickersUtilsProvider>
      <CssBaseline />
    </React.Fragment>
  </JssProvider>
);

export default App;
