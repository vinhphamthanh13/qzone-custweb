import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/Brand';
import NavBar from 'components/NavBar';
import Content from 'components/Content';
import '../Organisation.scss';

const sectionClasses = {
  brand: {
    logo: {
      root: 'org-page__section-1__logo',
    },
    brand: {
      root: 'org-page__section-1__brand header2 ghost-white',
    },
    wrapper: {
      root: 'org-page__section-1__brand-wrapper',
    },
  },
  title: {
    root: 'org-page__section-1__title header1 text-bold',
  },
  button: {
    root: 'org-page__button bg-we-peep mako',
  },
  paragraph: 'org-page__section-1__paragraph',
  linkClass: 'org-page__section-1__nav-bar-item mako text-bold',
};

const Section1 = (props) => {
  const { menuButtons, logo } = props;
  const title = 'We care for your furry little loved ones<br/> while<br/>you\'re away';
  return (
    <React.Fragment>
      <Grid container justify="space-between">
        <Brand logo={logo} brandClass={sectionClasses.brand} />
        <NavBar buttons={menuButtons} linkClass={sectionClasses.linkClass} />
      </Grid>
      <Grid container justify="flex-end">
        <Content
          title={title}
          titleClass={sectionClasses.title}
          buttonLabel="Subscribe now"
          buttonClass={sectionClasses.button}
          paragraphClass={sectionClasses.paragraph}
        />
      </Grid>
    </React.Fragment>
  );
};

Section1.propTypes = {
  menuButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  logo: PropTypes.string,
};

Section1.defaultProps = {
  logo: 'null',
};

export default Section1;
