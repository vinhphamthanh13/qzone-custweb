import React, { Component } from 'react';
import { objectOf, any, func } from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import OrgLogo from 'images/dog_logo.jpg';
import { fetchOrg } from 'reduxModules/organisation.action';
import Section1 from './organisation/Section1';
import Section2 from './organisation/Section2';
import Section3 from './organisation/Section3';
import ServiceCard from './organisation/ServiceCard';
import ProviderCard from './organisation/ProviderCard';
import { serviceList, providerList } from './organisation/mockData';
import styles from './Organisation.module.scss';

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

class Organisation extends Component {
  componentDidMount() {
    const { fetchOrgAction } = this.props;
    fetchOrgAction();
  }

  render() {
    const { orgData } = this.props;
    const navButtons = getNavButtons(orgData);
    return (
      <React.Fragment>
        <div className={styles.wrapper}>
          <div className={styles.section1}>
            <div className={styles.overlay}>
              <Grid container justify="space-between" className={styles.navBarWrapper}>
                <Section1
                  menuButtons={navButtons}
                  logo={OrgLogo}
                />
              </Grid>
            </div>
          </div>
          <div className={styles.section2}>
            <Section2 />
          </div>
          <div className={styles.section3}>
            <Section3 />
          </div>
          <div className={styles.sectionServiceCard}>
            <ServiceCard cardList={serviceList} />
          </div>
          <div className={[styles.section3, styles.sectionProviderCard].join(' ')}>
            <ProviderCard cardList={providerList} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Organisation.propTypes = {
  orgData: objectOf(any),
  fetchOrgAction: func.isRequired,
};

Organisation.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default connect(null, {
  fetchOrgAction: fetchOrg,
})(Organisation);
