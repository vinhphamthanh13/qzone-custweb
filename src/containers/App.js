import React from 'react';
import Alert from 'react-s-alert';
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
import './App.module.scss';
import '../styles/_settings.scss';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point'),
});

export const history = createBrowserHistory();

Amplify.configure({
  Auth: {
    identityPoolId: 'ap-southeast-2:adab2657-684c-4222-a17a-9a82b6a5ee84',

    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-2',

    identityPoolRegion: 'ap-southeast-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-2_0sAegznUX',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '3ov1blo2eji4acnqfcv88tcidn',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: true,
  },
});

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
        </Provider>
      </MuiPickersUtilsProvider>
      <Alert stack effect="bouncyflip" position="top-right" />
      <CssBaseline />
    </React.Fragment>
  </JssProvider>
);

export default App;
