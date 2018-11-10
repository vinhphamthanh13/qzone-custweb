import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/common/Brand';
import NavBar from 'components/common/NavBar';
import Content from 'components/common/Content';
import ImageGridList from 'components/common/ImageGridList';
import Dog from 'images/dog.png';
import PetCare from 'images/custweb-pet.png';
import './Organisation.scss';
import ServiceCard from './ServiceCard';
import ProviderCard from './ProviderCard';

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
  const title1 = 'We care for your furry little loved ones<br/>while<br/>you\'re away';
  const title2 = 'Expert care for your furry, feathery, or scaley friend';
  const title3 = 'Services tailored<br/>to your needs';
  const content2 = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.'
  + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.'
  + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.';
  const content3 = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.'
  + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.'
  + 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
  + ' and publishing industries for previewing layouts and visual mockups.';
  const pix2 = [
    { name: 'dog0', src: Dog },
    { name: 'dog1', src: Dog },
    { name: 'dog2', src: Dog },
    { name: 'dog3', src: Dog },
  ];
  const pix1 = [
    { name: 'custweb-pet', src: PetCare },
  ];
  const cardList = [
    {
      name: 'dog0',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
    {
      name: 'dog1',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
    {
      name: 'dog2',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
    {
      name: 'dog3',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
  ];
  const providerList = [
    {
      name: 'dog0',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
    {
      name: 'dog1',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
    {
      name: 'dog2',
      src: Dog,
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum is placeholder text commonly used in the graphic, print'
      + ' and publishing industries for previewing layouts and visual mockups.',
    },
  ];

  return (
    <Grid container>
      <div className="organisation-page__header">
        <div className="organisation-page__overlay">
          <Grid container>
            <Grid container justify="space-between" className="organisation-page__brand">
              <Brand />
              <NavBar buttons={menuBar} />
            </Grid>
            <Grid container justify="flex-end">
              <Content
                title={title1}
                buttonClass="button--primary"
                buttonLabel="We care of it"
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <Grid
        container
        justify="space-evenly"
        className="organisation-page__content-block--no-background"
      >
        <Content
          subTitle={title2}
          content={content2}
          buttonClass="button--secondary"
          buttonLabel="We care of it"
        />
        <ImageGridList pixList={pix2} square={2} />
      </Grid>
      <div className="organisation-page__content-block--primary">
        <Grid
          container
          alignContent="stretch"
        >
          <ImageGridList pixList={pix1} square={1} />
          <Content
            subTitle={title3}
            content={content3}
            buttonLabel="Pet your loved one"
            buttonClass="button--secondary"
            contentClass="organisation-page__content-block--paragraph"
          />
        </Grid>
      </div>
      <div className="organisation-page__content-block--secondary">
        <ServiceCard cardList={cardList} />
      </div>
      <div className="organisation-page__content-block--primary">
        <ProviderCard cardList={providerList} />
      </div>
    </Grid>
  );
};

Header.propTypes = {
  orgData: PropTypes.objectOf(PropTypes.any),
};

Header.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default Header;
