import Home from 'pages/Home';
import Organisation from 'pages/organisation/Organisation';


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

];

export default rootRoutes;
