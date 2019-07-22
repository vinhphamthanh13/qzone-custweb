/* eslint-disable no-undef, func-names */

import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing';
import { PersistGate } from 'redux-persist/lib/integration/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Amplify from 'aws-amplify';
import 'config/api';
import {
  AUTH_METHOD,
  AWS_CONFIG,
  FB_API_VERSION,
  FB_APP_ID,
} from 'config/auth';
import store from 'config/store';
import 'styles/_settings.scss';
import 'react-vertical-timeline-component/style.min.css';
import { createGoogleScript } from 'authentication/actions/login';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const history = createBrowserHistory();

Amplify.configure(AWS_CONFIG);

class App extends Component {
  componentWillMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: FB_API_VERSION,
      });
      FB.AppEvents.logPageView();
    };

    const ga = window.gapi && window.gapi[AUTH_METHOD]
      ? window.gapi.auth2.getAuthInstance() : null;

    if (!ga) {
      createGoogleScript();
    }
  }

  render() {
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <React.Fragment>
          <Provider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
              <Router history={history}>
                <Switch>
                  {rootRoutes.map(route => (<Route key={route.name || route.path} {...route} />))}
                </Switch>
              </Router>
            </PersistGate>
          </Provider>
          <CssBaseline />
        </React.Fragment>
      </JssProvider>
    );
  }
}

export default App;
