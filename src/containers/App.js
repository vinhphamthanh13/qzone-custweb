import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Amplify from 'aws-amplify';
import 'config/api';
import { AWS_CONFIG } from 'config/auth';
import store from 'config/store';
import './App.module.scss';
import '../styles/_settings.scss';
import 'react-vertical-timeline-component/style.min.css';

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
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            {rootRoutes.map(route => (<Route key={route.name || route.path} {...route} />))}
          </Switch>
        </Router>
      </Provider>
      <CssBaseline />
    </React.Fragment>
  </JssProvider>
);

export default App;
