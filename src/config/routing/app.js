import Home from 'pages/Home';
import Organisation from 'pages/Organisation';
import PageNotFound from 'pages/PageNotFound';

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
    path: '/organisation/:id',
    name: 'Organisation',
    component: Organisation,
  },
  {
    exact: true,
    strict: true,
    name: '404',
    component: PageNotFound,
  },
];

export default rootRoutes;
