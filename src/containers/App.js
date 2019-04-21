import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import rootRoutes from 'config/routing/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import Amplify from 'aws-amplify';
import 'config/api';
import { AWS_CONFIG } from 'config/auth';
import store from 'config/store';
import 'styles/_settings.scss';
import 'react-vertical-timeline-component/style.min.css';


export const history = createBrowserHistory();

Amplify.configure(AWS_CONFIG);

const App = () => (
  <>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          {rootRoutes.map(route => (<Route key={route.name || route.path} {...route} />))}
        </Switch>
      </Router>
    </Provider>
    <CssBaseline />
  </>
);

export default App;
