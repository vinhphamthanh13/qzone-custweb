import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import OrgLogo from 'images/dog_logo.jpg';
import Section1 from './organisation/Section1';
import Section2 from './organisation/Section2';

const getNavButtons = (org) => {
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

const Organisation = (props) => {
  const { orgData } = props;
  const navButtons = getNavButtons(orgData);
  return (
    <React.Fragment>
      <div className="organisation-page__section1">
        <Grid container justify="space-between" className="organisation-page__navbar-wrapper">
          <Section1
            menuButtons={navButtons}
            logo={OrgLogo}
          />
        </Grid>
      </div>
      <Section2 />
    </React.Fragment>
  );
};

Organisation.propTypes = {
  orgData: PropTypes.objectOf(PropTypes.any),
};

Organisation.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default Organisation;
