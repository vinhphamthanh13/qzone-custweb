import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Brand from 'components/Brand';
import NavBar from 'components/NavBar';
import Content from 'components/Content';
import styles from '../Organisation.module.scss';

const sectionClasses = {
  brand: {
    logo: {
      root: styles.logo,
    },
    brand: {
      root: [styles.brand, 'header2', 'ghost-white'].join(' '),
    },
    wrapper: {
      root: styles.brandWrapper,
    },
  },
  title: {
    root: [styles.title, 'header1', 'text-bold'].join(' '),
  },
  button: {
    root: [styles.button, 'bg-we-peep', 'mako'].join(' '),
  },
  paragraph: styles.paragraph,
  linkClass: [styles.navBarItem, 'text-bold', 'mako'].join(' '),
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
