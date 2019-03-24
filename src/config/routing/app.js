import Home from 'pages/Home';
import Organisation from 'pages/Organisation';
import PageNotFound from 'pages/PageNotFound';
import AccessDenied from 'pages/AccessDenied';
import Provider from 'pages/Provider';

const rootRoutes = [
  {
    exact: true,
    strict: true,
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/appointments',
    name: 'Home',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/organisation/:id',
    name: 'Organisation',
    component: Organisation,
  },
  {
    exact: true,
    strict: true,
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied,
  },
  {
    exact: true,
    strict: true,
    path: '/profile',
    name: 'Profile',
    component: Home,
  },
  {
    exact: true,
    strict: true,
    path: '/provider/:id',
    name: 'Provider',
    component: Provider,
  },
  {
    exact: true,
    strict: true,
    name: '404',
    component: PageNotFound,
  },
];

export default rootRoutes;
