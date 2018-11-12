import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import OrgLogo from 'images/dog_logo.jpg';
import Dog from 'images/dog.png';
import Section1 from './organisation/Section1';
import Section2 from './organisation/Section2';
import Section3 from './organisation/Section3';
import ServiceCard from './organisation/ServiceCard';
import ProviderCard from './organisation/ProviderCard';

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

const serviceList = [
  {
    id: 0,
    name: 'dog0',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
  {
    id: 1,
    name: 'dog1',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
  {
    id: 2,
    name: 'dog2',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
  {
    id: 3,
    name: 'dog3',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
];
const providerList = [
  {
    id: 0,
    name: 'dog0',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
  {
    id: 1,
    name: 'dog1',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
  {
    id: 2,
    name: 'dog2',
    src: Dog,
    title: 'Lorem Ipsum',
    content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
  },
];

const Organisation = (props) => {
  const { orgData } = props;
  const navButtons = getNavButtons(orgData);
  return (
    <React.Fragment>
      <div className="org-page__section-1">
        <Grid container justify="space-between" className="org-page__navbar-wrapper">
          <Section1
            menuButtons={navButtons}
            logo={OrgLogo}
          />
        </Grid>
      </div>
      <div className="org-page__section-2">
        <Section2 />
      </div>
      <div className="org-page__section-3">
        <Section3 />
      </div>
      <div className="org-page__section-service-card">
        <ServiceCard cardList={serviceList} />
      </div>
      <div className="org-page__section-3 org-page__section-provider-card">
        <ProviderCard cardList={providerList} />
      </div>
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
