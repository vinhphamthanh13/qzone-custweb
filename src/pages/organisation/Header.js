import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/common/Brand';
import NavBar from 'components/common/NavBar';
import Content from 'components/common/Content';
import './Organisation.scss';

const navBar = (org) => {
  const { url } = org;
  const serviceUrl = `/${url}/service`;
  return ([
    {
      label: 'Home',
      path: '/',
      children: [],
    },
    {
      label: 'Services',
      path: serviceUrl,
      children: [
        { label: 'Vaccinate', path: `${serviceUrl}/vaccinate` },
        { label: 'Pet Care', path: `${serviceUrl}/pet-care` },
      ],
    },
    {
      label: 'Favorites',
      path: `/${url}/favorites`,
    },
    {
      label: 'Help',
      path: `/${url}/help`,
    },
  ]);
};

const Header = (props) => {
  const { orgData } = props;
  const menuBar = navBar(orgData);
  return (
    <div className="organisation-page__header">
      <div className="organisation-page__overlay">
        <Grid container>
          <Grid container justify="space-between" className="organisation-page__brand">
            <Brand />
            <NavBar buttons={menuBar} />
          </Grid>
          <Grid container justify="flex-end">
            <Content content="We care" />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Header.propTypes = {
  orgData: PropTypes.objectOf(PropTypes.object),
};

Header.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default Header;
