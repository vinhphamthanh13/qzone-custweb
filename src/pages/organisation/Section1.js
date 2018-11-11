import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/common/Brand';
import NavBar from 'components/common/NavBar';
import Content from 'components/common/Content';
import '../Organisation.scss';

const sectionClasses = {
  logo: {
    root: 'organisation-page__logo',
  },
  brand: {
    root: 'organisation-page__brand header2 ghost-white',
  },
  title: {
    root: 'organisation-page__title header1 text-bold',
  },
  button: {
    root: 'organisation-page__button',
  },
};

const Section1 = (props) => {
  const { menuButtons, logo } = props;
  const title = 'We care for your furry little loved ones<br/> while<br/>you\'re away';
  return (
    <React.Fragment>
      <Brand logo={logo} brandClass={sectionClasses} />
      <NavBar buttons={menuButtons} />
      <Grid container justify="flex-end">
        <Content
          title={title}
          titleClass={sectionClasses.title}
          buttonLabel="Subscribe now"
          buttonClass={sectionClasses.button}
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
