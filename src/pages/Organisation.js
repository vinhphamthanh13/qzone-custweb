import React, { Component } from 'react';
import {
  objectOf, any, func, bool,
} from 'prop-types';
import { matchType } from 'types/global';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { Call, Web } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { fetchOrg } from 'reduxModules/organisation.action';
import Loading from 'components/Loading';
import Section1 from './organisation/Section1';
import Section2 from './organisation/Section2';
import Section3 from './organisation/Section3';
import ServiceCard from './organisation/ServiceCard';
import ProviderCard from './organisation/ProviderCard';
import { serviceList, providerList } from './organisation/mockData';
import OrgFooter from './home/footer/Footer';
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
    const { fetchOrgAction, match: { params: { id } } } = this.props;
    fetchOrgAction(id);
  }

  render() {
    const { orgData, orgs, isLoading } = this.props;
    const navButtons = getNavButtons(orgData);
    const orgName = get(orgs, 'name');
    const logo = get(orgs, 'logo.fileUrl');
    const orgTel = get(orgs, 'telephone');
    const orgSite = get(orgs, 'website');

    return (
      <>
        <div className={styles.orgBanner}>
          <div className="icon-text text-margin-right">
            <Call className="icon-white icon-small" />
            <Typography variant="body2" color="inherit">{orgTel}</Typography>
          </div>
          <div className="icon-text text-margin-right">
            <Web className="icon-white icon-small" />
            <Typography variant="body2" color="inherit">{orgSite}</Typography>
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.section1}>
            <div className={styles.overlay}>
              <Grid container justify="space-between" className={styles.navBarWrapper}>
                <Section1
                  menuButtons={navButtons}
                  logo={logo}
                  orgName={orgName}
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
          <OrgFooter loading={isLoading} />
        </div>
        <Loading />
      </>
    );
  }
}

Organisation.propTypes = {
  orgData: objectOf(any),
  isLoading: bool.isRequired,
  fetchOrgAction: func.isRequired,
  match: matchType.isRequired,
  orgs: objectOf(any).isRequired,
};

Organisation.defaultProps = {
  orgData: {
    url: '/organisation',
  },
};

export default connect(state => ({
  orgs: state.organisation.orgs,
  isLoading: state.organisation.isLoading,
}), {
  fetchOrgAction: fetchOrg,
})(Organisation);
