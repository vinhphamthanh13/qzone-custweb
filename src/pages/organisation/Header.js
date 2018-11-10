import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/common/Brand';
import NavBar from 'components/common/NavBar';
import Content from 'components/common/Content';
import ImageGridList from 'components/common/ImageGridList';
import Dog from 'images/dog.png';
import './Organisation.scss';

const styles = theme => ({
  root: {
    display: 'flex',
    margin: `${theme.spacing.unit * 8}px`,
  },
});

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
  const { orgData, classes } = props;
  const menuBar = navBar(orgData);
  const title1 = 'We care for your furry little loved ones while you\'re away';
  const title2 = 'Expert care for your furry, feathery, or scaley friend';
  const content2 = 'Lorem ipsum is placeholder text commonly used in the graphic, print,'
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
        className={classNames(classes.root, 'organisation-page__content-wrapper')}
      >
        <Content
          subTitle={title2}
          content={content2}
          buttonClass="button--mako"
          buttonLabel="We care of it"
        />
        <ImageGridList pixList={pix2} />
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  orgData: PropTypes.objectOf(PropTypes.object),
  classes: PropTypes.objectOf(PropTypes.object).isRequired,
};

Header.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default withStyles(styles)(Header);
