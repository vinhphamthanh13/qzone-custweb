/* eslint-disable no-undef, func-names */

import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import windowSize from 'react-window-size';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing';
import { PersistGate } from 'redux-persist/lib/integration/react';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import Amplify from 'aws-amplify';
import 'config/api';
import { AUTH_METHOD, AWS_CONFIG } from 'config/auth';
import store from 'config/store';
import 'styles/_settings.scss';
import 'react-vertical-timeline-component/style.min.css';
import { createGoogleScript } from 'authentication/actions/login';
import Layout from 'components/Layout/Layout';
import { DEVICE_MIN_WIDTH } from 'utils/constants';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const history = createBrowserHistory();

Amplify.configure(AWS_CONFIG);

class App extends Component {
  state = {
    windowWidth: 0,
  };

  static getDerivedStateFromProps(props, state) {
    const { windowWidth } = props;
    const { windowWidth: cachedWindowWidth } = state;
    const updatedState = {};
    if (windowWidth !== cachedWindowWidth) {
      updatedState.windowWidth = windowWidth;
    }

    return Object.keys(updatedState) ? updatedState : null;
  }

  componentDidMount() {
    const ga = window.gapi && window.gapi[AUTH_METHOD]
      ? window.gapi.auth2.getAuthInstance() : null;

    if (!ga) {
      createGoogleScript();
    }
  }

  render() {
    const { windowWidth } = this.state;
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <>
          <Provider store={store.store}>
            <PersistGate loading={null} persistor={store.persistor}>
              <Router history={history}>
                {windowWidth < DEVICE_MIN_WIDTH ? <Layout /> : (
                  <Switch>
                    {rootRoutes.map(route => (<Route key={route.name || route.path} {...route} />))}
                  </Switch>
                )}
              </Router>
            </PersistGate>
          </Provider>
          <CssBaseline />
        </>
      </JssProvider>
    );
  }
}

export default windowSize(App);
